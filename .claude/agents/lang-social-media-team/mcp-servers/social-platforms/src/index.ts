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
import { TwitterApi } from 'twitter-api-v2';
import Snoowrap from 'snoowrap';
import { config } from 'dotenv';

config();

// Tool schemas
const PostToTwitterSchema = z.object({
  text: z.string().max(280),
  media_ids: z.array(z.string()).optional(),
  reply_to: z.string().optional(),
  scheduled_for: z.string().optional(),
});

const PostToLinkedInSchema = z.object({
  text: z.string(),
  media_urls: z.array(z.string()).optional(),
  company_page: z.boolean().optional(),
  scheduled_for: z.string().optional(),
});

const PostToRedditSchema = z.object({
  subreddit: z.string(),
  title: z.string(),
  text: z.string().optional(),
  url: z.string().optional(),
  type: z.enum(['text', 'link']),
});

const GetEngagementMetricsSchema = z.object({
  platform: z.enum(['twitter', 'linkedin', 'reddit']),
  post_ids: z.array(z.string()),
  timeframe: z.string().optional().default('24h'),
});

const SchedulePostSchema = z.object({
  platforms: z.array(z.enum(['twitter', 'linkedin', 'reddit'])),
  content: z.object({
    text: z.string(),
    media: z.array(z.string()).optional(),
    hashtags: z.array(z.string()).optional(),
  }),
  scheduled_for: z.string(),
});

class SocialPlatformsMCPServer {
  private server: Server;
  private twitterClient?: TwitterApi;
  private redditClient?: Snoowrap;

  constructor() {
    this.server = new Server(
      {
        name: 'social-platforms-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.initializeClients();
  }

  private initializeClients() {
    // Initialize Twitter client
    if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
      this.twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });
    }

    // Initialize Reddit client
    if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
      this.redditClient = new Snoowrap({
        userAgent: 'social-media-agent/1.0.0',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
      });
    }
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'post_to_twitter',
          description: 'Post a tweet to Twitter/X',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'Tweet text (max 280 characters)',
                maxLength: 280,
              },
              media_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional media IDs to attach',
              },
              reply_to: {
                type: 'string',
                description: 'Tweet ID to reply to (optional)',
              },
              scheduled_for: {
                type: 'string',
                description: 'ISO date string for scheduled posting (optional)',
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'post_to_linkedin',
          description: 'Post to LinkedIn (personal or company page)',
          inputSchema: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'Post content text',
              },
              media_urls: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional media URLs to attach',
              },
              company_page: {
                type: 'boolean',
                description: 'Post to company page instead of personal',
              },
              scheduled_for: {
                type: 'string',
                description: 'ISO date string for scheduled posting (optional)',
              },
            },
            required: ['text'],
          },
        },
        {
          name: 'post_to_reddit',
          description: 'Post to a Reddit subreddit',
          inputSchema: {
            type: 'object',
            properties: {
              subreddit: {
                type: 'string',
                description: 'Subreddit name (without r/)',
              },
              title: {
                type: 'string',
                description: 'Post title',
              },
              text: {
                type: 'string',
                description: 'Post text content (for text posts)',
              },
              url: {
                type: 'string',
                description: 'URL to share (for link posts)',
              },
              type: {
                type: 'string',
                enum: ['text', 'link'],
                description: 'Type of Reddit post',
              },
            },
            required: ['subreddit', 'title', 'type'],
          },
        },
        {
          name: 'get_engagement_metrics',
          description: 'Get engagement metrics for posts across platforms',
          inputSchema: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['twitter', 'linkedin', 'reddit'],
                description: 'Platform to get metrics from',
              },
              post_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of post IDs to analyze',
              },
              timeframe: {
                type: 'string',
                description: 'Timeframe for metrics (e.g., "24h", "7d", "30d")',
                default: '24h',
              },
            },
            required: ['platform', 'post_ids'],
          },
        },
        {
          name: 'schedule_multi_platform_post',
          description: 'Schedule a post across multiple platforms',
          inputSchema: {
            type: 'object',
            properties: {
              platforms: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['twitter', 'linkedin', 'reddit'],
                },
                description: 'Platforms to post to',
              },
              content: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  media: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  hashtags: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['text'],
              },
              scheduled_for: {
                type: 'string',
                description: 'ISO date string for scheduled posting',
              },
            },
            required: ['platforms', 'content', 'scheduled_for'],
          },
        },
        {
          name: 'get_platform_trends',
          description: 'Get trending topics and hashtags from platforms',
          inputSchema: {
            type: 'object',
            properties: {
              platform: {
                type: 'string',
                enum: ['twitter', 'linkedin', 'reddit'],
                description: 'Platform to get trends from',
              },
              location: {
                type: 'string',
                description: 'Location for localized trends (optional)',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of trends to return',
                default: 10,
              },
            },
            required: ['platform'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'post_to_twitter':
            return await this.postToTwitter(PostToTwitterSchema.parse(args));
          case 'post_to_linkedin':
            return await this.postToLinkedIn(PostToLinkedInSchema.parse(args));
          case 'post_to_reddit':
            return await this.postToReddit(PostToRedditSchema.parse(args));
          case 'get_engagement_metrics':
            return await this.getEngagementMetrics(GetEngagementMetricsSchema.parse(args));
          case 'schedule_multi_platform_post':
            return await this.scheduleMultiPlatformPost(SchedulePostSchema.parse(args));
          case 'get_platform_trends':
            return await this.getPlatformTrends(args as any);
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

  private async postToTwitter(params: z.infer<typeof PostToTwitterSchema>) {
    if (!this.twitterClient) {
      throw new Error('Twitter client not initialized');
    }

    try {
      const tweetOptions: any = { text: params.text };
      
      if (params.media_ids) {
        tweetOptions.media = { media_ids: params.media_ids };
      }
      
      if (params.reply_to) {
        tweetOptions.reply = { in_reply_to_tweet_id: params.reply_to };
      }

      const tweet = await this.twitterClient.v2.tweet(tweetOptions);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              platform: 'twitter',
              post_id: tweet.data.id,
              text: params.text,
              url: `https://twitter.com/user/status/${tweet.data.id}`,
              posted_at: new Date().toISOString(),
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
              platform: 'twitter',
              error: error.message,
            }, null, 2),
          },
        ],
      };
    }
  }

  private async postToLinkedIn(params: z.infer<typeof PostToLinkedInSchema>) {
    // LinkedIn API implementation would go here
    // For now, return a mock response
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            platform: 'linkedin',
            post_id: 'mock_linkedin_id',
            text: params.text,
            company_page: params.company_page || false,
            posted_at: new Date().toISOString(),
            note: 'LinkedIn integration requires additional setup',
          }, null, 2),
        },
      ],
    };
  }

  private async postToReddit(params: z.infer<typeof PostToRedditSchema>) {
    if (!this.redditClient) {
      throw new Error('Reddit client not initialized');
    }

    try {
      let submission;
      
      if (params.type === 'text') {
        submission = await this.redditClient.getSubreddit(params.subreddit)
          .submitSelfpost({ title: params.title, text: params.text || '' });
      } else {
        submission = await this.redditClient.getSubreddit(params.subreddit)
          .submitLink({ title: params.title, url: params.url! });
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              platform: 'reddit',
              post_id: submission.id,
              title: params.title,
              subreddit: params.subreddit,
              url: `https://reddit.com${submission.permalink}`,
              posted_at: new Date().toISOString(),
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
              platform: 'reddit',
              error: error.message,
            }, null, 2),
          },
        ],
      };
    }
  }

  private async getEngagementMetrics(params: z.infer<typeof GetEngagementMetricsSchema>) {
    // Implementation would fetch real metrics from platform APIs
    // For now, return mock data
    const mockMetrics = params.post_ids.map(postId => ({
      post_id: postId,
      platform: params.platform,
      impressions: Math.floor(Math.random() * 10000),
      engagements: Math.floor(Math.random() * 500),
      likes: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 25),
      clicks: Math.floor(Math.random() * 100),
      engagement_rate: (Math.random() * 5).toFixed(2) + '%',
      collected_at: new Date().toISOString(),
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            platform: params.platform,
            timeframe: params.timeframe,
            metrics: mockMetrics,
          }, null, 2),
        },
      ],
    };
  }

  private async scheduleMultiPlatformPost(params: z.infer<typeof SchedulePostSchema>) {
    // Implementation would handle scheduling across platforms
    // For now, return mock scheduling confirmation
    const scheduleResults = params.platforms.map(platform => ({
      platform,
      scheduled: true,
      scheduled_for: params.scheduled_for,
      schedule_id: `${platform}_schedule_${Date.now()}`,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            content: params.content,
            platforms: params.platforms,
            scheduled_for: params.scheduled_for,
            results: scheduleResults,
          }, null, 2),
        },
      ],
    };
  }

  private async getPlatformTrends(params: { platform: string; location?: string; limit?: number }) {
    // Implementation would fetch real trends from platform APIs
    // For now, return mock trending data
    const mockTrends = Array.from({ length: params.limit || 10 }, (_, i) => ({
      rank: i + 1,
      topic: `Trending Topic ${i + 1}`,
      hashtag: `#trending${i + 1}`,
      volume: Math.floor(Math.random() * 100000),
      change_24h: ((Math.random() - 0.5) * 100).toFixed(1) + '%',
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            platform: params.platform,
            location: params.location || 'global',
            trends: mockTrends,
            updated_at: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Social Platforms MCP Server running on stdio');
  }
}

const server = new SocialPlatformsMCPServer();
server.run().catch(console.error);