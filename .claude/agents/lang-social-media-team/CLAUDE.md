# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development and Testing
```bash
# Start LangGraph server (in-memory)
yarn langgraph:in_mem:up
# Alternative with persistent storage
yarn langgraph:up

# Run unit tests
yarn test

# Run integration tests  
yarn test:int

# Run single test file
yarn test:single <test-file-pattern>

# Run all tests and linting
yarn test:all

# Build TypeScript
yarn build

# Clean build artifacts
yarn clean
```

### Code Quality
```bash
# Format code
yarn format

# Check formatting
yarn format:check

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Lint LangGraph JSON configuration
yarn lint:langgraph-json

# Run all linting
yarn lint:all
```

### Graph Operations
```bash
# Generate a single post
yarn generate_post

# Start authentication server
yarn start:auth

# Manage cron jobs
yarn cron:create
yarn cron:delete
yarn cron:list

# Utility scripts
yarn graph:backfill
yarn get:scheduled_runs
yarn get:used_links
yarn graph:delete:run_thread
```

## High-Level Architecture

This is a **LangGraph-based social media agent** that converts URLs into Twitter/LinkedIn posts using a human-in-the-loop workflow. The system follows a multi-agent architecture with specialized graphs for different tasks.

### Core Graph Structure

The system is built around **17 different LangGraph workflows** defined in `langgraph.json`:

1. **generate_post** - Main workflow for creating social media posts from URLs
2. **supervisor** - Orchestrates data curation and bulk post generation
3. **curate_data** - Fetches and processes content from various sources (Twitter, GitHub, Reddit, Slack)
4. **ingest_data** - Handles data ingestion from external sources
5. **repurposer** - Repurposes existing content into new posts
6. **generate_thread** - Creates Twitter thread sequences
7. **verify_tweet/verify_reddit_post** - Content validation workflows
8. **reflection** - Post quality assessment and improvement
9. **upload_post** - Handles posting to social platforms
10. Various interrupt graphs for human-in-the-loop interactions

### Agent Architecture Pattern

Each agent follows a consistent structure:
- `index.ts` - Main graph definition and compilation
- `nodes/` - Individual processing steps  
- `state.ts` - State management and annotations
- `types.ts` - Type definitions
- `tests/` - Integration and unit tests

### Data Flow

1. **URL Ingestion** → Content extraction via FireCrawl
2. **Content Verification** → Platform-specific validation (Twitter API, Reddit API, GitHub API)
3. **Report Generation** → AI-powered content analysis and relevance scoring
4. **Post Generation** → LLM-based post creation with style guidelines
5. **Human Review** → Interrupt for approval/editing via Agent Inbox
6. **Scheduling/Publishing** → Platform posting via Arcade or native APIs

### Key Components

#### State Management
- Uses LangGraph `Annotation` pattern for type-safe state
- Configurable parameters via `ConfigurableAnnotation`
- State persistence across graph interruptions

#### Content Processing Pipeline
- **Loaders** (`src/agents/curate-data/loaders/`) - Platform-specific data fetching
- **Verification** - Content validation and URL expansion
- **Image Processing** - Screenshot capture and image selection
- **Post Formatting** - Character limits, hashtags, mentions

#### Authentication & APIs
- **Arcade Integration** - Simplified social media auth
- **OAuth Flows** - Twitter/LinkedIn developer account support
- **Multi-platform Support** - Twitter, LinkedIn, Slack, GitHub, Reddit

### Integration Points

#### External Services
- **LangSmith** - Tracing and observability
- **Anthropic/OpenAI** - Content generation LLMs
- **Google Vertex AI** - YouTube content processing
- **FireCrawl** - Web scraping and content extraction
- **Supabase** - Image storage and metadata
- **Playwright** - Screenshot automation

#### Data Sources
- Twitter (via API v2 and Arcade)
- GitHub (trending repos, release notes)
- Reddit (subreddit monitoring)
- Slack (channel message ingestion)
- YouTube (video summaries)
- General web content (via FireCrawl)

### Configuration Files

- `langgraph.json` - Graph definitions and routing
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript compilation settings
- `jest.config.js` - Test configuration with ESM support
- `.env` - Environment variables for API keys and settings

### Testing Strategy

- **Unit Tests** (`.test.ts`) - Individual function testing
- **Integration Tests** (`.int.test.ts`) - Full workflow testing with real APIs
- **E2E Tests** - Complete user journey validation
- Jest with TypeScript ESM support
- 20-second default timeout for API-dependent tests

### Human-in-the-Loop Pattern

The system uses **interrupt-driven workflows** where:
1. AI generates initial content
2. Graph pauses at strategic points
3. Human reviews via Agent Inbox UI
4. User can approve, edit, or reject
5. Graph resumes based on human input

### Performance Considerations

- **Parallel Processing** - Uses LangGraph `Send` for concurrent operations
- **Caching** - Stores processed URLs to avoid duplicate work
- **Rate Limiting** - Respects API limits across platforms
- **Memory Management** - In-memory mode for development, persistent for production

## Development Notes

### Environment Setup
- Node.js 20+ required (specified in `langgraph.json`)
- Yarn package manager (specified in `package.json`)
- LangGraph CLI for local development
- Multiple API keys required (see README.md for full list)

### Testing Patterns
- Use `cross-env TZ=America/Los_Angeles` for consistent timezone testing
- Integration tests require real API credentials
- Test data located in `src/tests/data/`
- Mock responses available in test files

### Customization Points
- **Prompts** - Located in `src/agents/generate-post/prompts/`
- **Business Context** - Update for different industries/use cases  
- **Post Examples** - Modify few-shot examples for style changes
- **Content Rules** - Adjust writing guidelines and structure

### Graph Deployment
- Supports both local development (`yarn dev`) and production deployment
- Docker support with Playwright dependencies
- Environment-based configuration switching
- LangGraph Platform integration for scaling