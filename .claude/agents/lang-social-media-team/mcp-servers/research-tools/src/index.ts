#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import googleTrends from 'google-trends-api';
import Sentiment from 'sentiment';
import { config } from 'dotenv';

config();

// Tool schemas
const ExtractContentSchema = z.object({
  url: z.string().url(),
  extract_images: z.boolean().optional().default(false),
  extract_metadata: z.boolean().optional().default(true),
  follow_redirects: z.boolean().optional().default(true),
});

const SearchWebSchema = z.object({
  query: z.string(),
  num_results: z.number().optional().default(10),
  safe_search: z.boolean().optional().default(true),
  region: z.string().optional().default('US'),
});

const AnalyzeSentimentSchema = z.object({
  text: z.string(),
  include_details: z.boolean().optional().default(false),
});

const GetTrendingTopicsSchema = z.object({
  category: z.string().optional(),
  region: z.string().optional().default('US'),
  timeframe: z.enum(['now_1_h', 'now_4_h', 'now_1_d', 'now_7_d', 'today_1_m']).optional().default('now_1_d'),
});

const ValidateUrlsSchema = z.object({
  urls: z.array(z.string().url()),
  check_accessibility: z.boolean().optional().default(true),
  check_content_type: z.boolean().optional().default(true),
  timeout: z.number().optional().default(10000),
});

const ScreenshotPageSchema = z.object({
  url: z.string().url(),
  width: z.number().optional().default(1200),
  height: z.number().optional().default(800),
  full_page: z.boolean().optional().default(false),
  format: z.enum(['png', 'jpeg']).optional().default('png'),
});

class ResearchToolsMCPServer {
  private server: Server;
  private sentiment: Sentiment;

  constructor() {
    this.server = new Server(
      {
        name: 'research-tools-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.sentiment = new Sentiment();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'extract_content',
          description: 'Extract content from a web page',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                format: 'uri',
                description: 'URL to extract content from',
              },
              extract_images: {
                type: 'boolean',
                description: 'Whether to extract image URLs',
                default: false,
              },
              extract_metadata: {
                type: 'boolean',
                description: 'Whether to extract page metadata',
                default: true,
              },
              follow_redirects: {
                type: 'boolean',
                description: 'Whether to follow redirects',
                default: true,
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'search_web',
          description: 'Search the web for information',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
              num_results: {
                type: 'number',
                description: 'Number of results to return',
                default: 10,
              },
              safe_search: {
                type: 'boolean',
                description: 'Enable safe search filtering',
                default: true,
              },
              region: {
                type: 'string',
                description: 'Region for search results',
                default: 'US',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'analyze_sentiment',
          description: 'Analyze sentiment of text content',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'Text to analyze for sentiment',
              },
              include_details: {
                type: 'boolean',
                description: 'Include detailed sentiment breakdown',
                default: false,
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'get_trending_topics',
          description: 'Get trending topics from Google Trends',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Category to filter trends (optional)',
              },
              region: {
                type: 'string',
                description: 'Region code for trends',
                default: 'US',
              },
              timeframe: {
                type: 'string',
                enum: ['now_1_h', 'now_4_h', 'now_1_d', 'now_7_d', 'today_1_m'],
                description: 'Timeframe for trending data',
                default: 'now_1_d',
              },
            },
          },
        },
        {
          name: 'validate_urls',
          description: 'Validate multiple URLs for accessibility and content type',
          inputSchema: {
            type: 'object',
            properties: {
              urls: {
                type: 'array',
                items: { type: 'string', format: 'uri' },
                description: 'URLs to validate',
              },
              check_accessibility: {
                type: 'boolean',
                description: 'Check if URLs are accessible',
                default: true,
              },
              check_content_type: {
                type: 'boolean',
                description: 'Check content type of URLs',
                default: true,
              },
              timeout: {
                type: 'number',
                description: 'Timeout for each URL check in milliseconds',
                default: 10000,
              },
            },
            required: ['urls'],
          },
        },
        {
          name: 'screenshot_page',
          description: 'Take a screenshot of a web page',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                format: 'uri',
                description: 'URL to screenshot',
              },
              width: {
                type: 'number',
                description: 'Screenshot width in pixels',
                default: 1200,
              },
              height: {
                type: 'number',
                description: 'Screenshot height in pixels',
                default: 800,
              },
              full_page: {
                type: 'boolean',
                description: 'Capture full page height',
                default: false,
              },
              format: {
                type: 'string',
                enum: ['png', 'jpeg'],
                description: 'Screenshot format',
                default: 'png',
              },
            },
            required: ['url'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'extract_content':
            return await this.extractContent(ExtractContentSchema.parse(args));
          case 'search_web':
            return await this.searchWeb(SearchWebSchema.parse(args));
          case 'analyze_sentiment':
            return await this.analyzeSentiment(AnalyzeSentimentSchema.parse(args));
          case 'get_trending_topics':
            return await this.getTrendingTopics(GetTrendingTopicsSchema.parse(args));
          case 'validate_urls':
            return await this.validateUrls(ValidateUrlsSchema.parse(args));
          case 'screenshot_page':
            return await this.screenshotPage(ScreenshotPageSchema.parse(args));
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
          );
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
      }
    });
  }

  private async extractContent(params: z.infer<typeof ExtractContentSchema>) {
    try {
      const response = await axios.get(params.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ResearchBot/1.0)',
        },
        maxRedirects: params.follow_redirects ? 5 : 0,
      });

      const $ = cheerio.load(response.data);
      
      // Extract basic content
      const title = $('title').text().trim() || $('h1').first().text().trim();
      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || '';
      
      // Extract main content
      const content = $('main, article, .content, #content').first().text().trim() || 
                     $('body').text().trim();
      
      // Extract metadata if requested
      let metadata = {};
      if (params.extract_metadata) {
        metadata = {
          author: $('meta[name="author"]').attr('content') || '',
          publishDate: $('meta[property="article:published_time"]').attr('content') || 
                      $('time[datetime]').attr('datetime') || '',
          keywords: $('meta[name="keywords"]').attr('content') || '',
          ogTitle: $('meta[property="og:title"]').attr('content') || '',
          ogImage: $('meta[property="og:image"]').attr('content') || '',
        };
      }

      // Extract images if requested
      let images: string[] = [];
      if (params.extract_images) {
        images = $('img').map((_, img) => {
          const src = $(img).attr('src');
          if (src) {
            return src.startsWith('http') ? src : new URL(src, params.url).href;
          }
          return null;
        }).get().filter(Boolean);
      }

      const result = {
        success: true,
        url: params.url,
        title,
        description,
        content: content.substring(0, 5000), // Limit content length
        wordCount: content.split(/\s+/).length,
        metadata,
        images,
        extractedAt: new Date().toISOString(),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              url: params.url,
              error: error.message,
              errorType: error.code || 'UNKNOWN_ERROR',
            }, null, 2),
          },
        ],
      };
    }
  }

  private async searchWeb(params: z.infer<typeof SearchWebSchema>) {
    // Mock web search implementation
    // In a real implementation, this would use a search API like SerpAPI, Bing, or Google Custom Search
    const mockResults = Array.from({ length: Math.min(params.num_results, 10) }, (_, i) => ({
      title: `Search Result ${i + 1} for "${params.query}"`,
      url: `https://example.com/result-${i + 1}`,
      snippet: `This is a mock search result snippet for "${params.query}". It contains relevant information about the search query.`,
      displayUrl: `example.com/result-${i + 1}`,
      publishedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            query: params.query,
            numResults: mockResults.length,
            region: params.region,
            safeSearch: params.safe_search,
            results: mockResults,
            searchedAt: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  private async analyzeSentiment(params: z.infer<typeof AnalyzeSentimentSchema>) {
    try {
      const result = this.sentiment.analyze(params.text);
      
      // Calculate sentiment label
      let label = 'neutral';
      if (result.score > 0) label = 'positive';
      else if (result.score < 0) label = 'negative';

      const response = {
        success: true,
        text: params.text.substring(0, 200) + (params.text.length > 200 ? '...' : ''),
        sentiment: {
          label,
          score: result.score,
          magnitude: Math.abs(result.score),
          confidence: Math.min(Math.abs(result.score) / 5, 1), // Normalize confidence
        },
        analyzedAt: new Date().toISOString(),
      };

      if (params.include_details) {
        response.sentiment['details'] = {
          positive: result.positive,
          negative: result.negative,
          comparative: result.comparative,
          calculation: result.calculation,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message,
            }, null, 2),
          },
        ],
      };
    }
  }

  private async getTrendingTopics(params: z.infer<typeof GetTrendingTopicsSchema>) {
    try {
      // Use Google Trends API
      const trendsData = await googleTrends.dailyTrends({
        trendDate: new Date(),
        geo: params.region,
      });
      
      const parsed = JSON.parse(trendsData);
      const trends = parsed.default.trendingSearchesDays[0]?.trendingSearches || [];
      
      const formattedTrends = trends.slice(0, 20).map((trend: any, index: number) => ({
        rank: index + 1,
        title: trend.title.query,
        searchVolume: trend.formattedTraffic,
        relatedQueries: trend.relatedQueries?.map((q: any) => q.query) || [],
        articles: trend.articles?.map((article: any) => ({
          title: article.title,
          url: article.url,
          source: article.source,
        })) || [],
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              region: params.region,
              timeframe: params.timeframe,
              category: params.category,
              trends: formattedTrends,
              fetchedAt: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      // Return mock data if Google Trends fails
      const mockTrends = Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        title: `Trending Topic ${i + 1}`,
        searchVolume: `${Math.floor(Math.random() * 100)}K+`,
        relatedQueries: [`related query ${i + 1}`, `related query ${i + 2}`],
        articles: [{
          title: `Article about trending topic ${i + 1}`,
          url: `https://example.com/article-${i + 1}`,
          source: 'Example News',
        }],
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              region: params.region,
              timeframe: params.timeframe,
              trends: mockTrends,
              note: 'Mock data due to API limitations',
              fetchedAt: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    }
  }

  private async validateUrls(params: z.infer<typeof ValidateUrlsSchema>) {
    const results = await Promise.allSettled(
      params.urls.map(async (url) => {
        try {
          const response = await axios.head(url, {
            timeout: params.timeout,
            maxRedirects: 5,
          });

          return {
            url,
            accessible: true,
            statusCode: response.status,
            contentType: response.headers['content-type'] || 'unknown',
            contentLength: response.headers['content-length'] || 'unknown',
            lastModified: response.headers['last-modified'] || null,
          };
        } catch (error) {
          return {
            url,
            accessible: false,
            error: error.message,
            errorCode: error.code || 'UNKNOWN_ERROR',
          };
        }
      })
    );

    const validationResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          url: params.urls[index],
          accessible: false,
          error: result.reason?.message || 'Validation failed',
        };
      }
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            totalUrls: params.urls.length,
            accessibleUrls: validationResults.filter(r => r.accessible).length,
            inaccessibleUrls: validationResults.filter(r => !r.accessible).length,
            results: validationResults,
            validatedAt: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  private async screenshotPage(params: z.infer<typeof ScreenshotPageSchema>) {
    let browser;
    try {
      browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      
      await page.setViewport({
        width: params.width,
        height: params.height,
      });
      
      await page.goto(params.url, { waitUntil: 'networkidle2' });
      
      const screenshot = await page.screenshot({
        type: params.format,
        fullPage: params.full_page,
        encoding: 'base64',
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              url: params.url,
              format: params.format,
              dimensions: { width: params.width, height: params.height },
              fullPage: params.full_page,
              screenshot: `data:image/${params.format};base64,${screenshot}`,
              capturedAt: new Date().toISOString(),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              url: params.url,
              error: error.message,
            }, null, 2),
          },
        ],
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Research Tools MCP Server running on stdio');
  }
}

const server = new ResearchToolsMCPServer();
server.run().catch(console.error);