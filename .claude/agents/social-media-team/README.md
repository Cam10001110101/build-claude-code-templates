# Social Media Team - Claude Code Sub-Agents

A pure Claude Code sub-agent implementation for comprehensive social media management, refactored from the original LangGraph-based system.

## Overview

This social media team consists of specialized Claude Code sub-agents that work together to research, create, schedule, review, and analyze social media content across multiple platforms. The system uses native Claude Code tools and MCP integrations instead of custom implementations.

## Architecture

### Core Agents

1. **social-media-orchestrator** 
   - Central coordinator for all workflows
   - Routes tasks to appropriate sub-agents
   - Manages state with TodoWrite
   - Handles error recovery

2. **social-media-researcher**
   - Extracts insights from URLs and content
   - Analyzes trends and competitors
   - Uses WebFetch and WebSearch
   - Integrates with Build Vault MCP

3. **social-media-writer**
   - Creates platform-optimized content
   - Maintains brand voice consistency
   - Generates multiple format variations
   - Includes engagement optimization

4. **social-media-scheduler**
   - Optimizes posting times
   - Manages content calendars
   - Coordinates multi-platform campaigns
   - Integrates with Linear for tracking

5. **social-media-analyzer**
   - Tracks performance metrics
   - Identifies content patterns
   - Generates actionable insights
   - Provides optimization recommendations

6. **social-media-reviewer**
   - Human-in-the-loop quality assurance
   - Brand consistency verification
   - Risk assessment and compliance
   - Feedback and approval workflow

## Key Differences from LangGraph Version

### Simplified Architecture
- No custom MCP servers required
- Native Claude Code tool usage
- Simplified state management via TodoWrite
- Direct agent coordination with Task tool

### Tool Mappings
- Custom loaders → WebFetch/WebSearch
- File-based state → TodoWrite
- Subprocess agents → Task tool
- Custom AI servers → Native Claude capabilities
- Database storage → Read/Write files

## Usage

### Basic Content Creation
```
@social-media-orchestrator Create social media posts from https://example.com/article
```

### Campaign Management
```
@social-media-orchestrator Launch a week-long campaign about our new product with daily posts
```

### Performance Analysis
```
@social-media-analyzer Review our Twitter performance for the past month
```

### Content Review
```
@social-media-reviewer Review these social posts before scheduling
```

## Workflow Examples

### URL to Social Posts
1. Orchestrator receives URL
2. Researcher extracts insights
3. Writer creates platform content
4. Reviewer approves content
5. Scheduler optimizes timing
6. Analyzer tracks performance

### Trend-Based Content
1. Researcher identifies trends
2. Writer creates timely content
3. Reviewer fast-tracks approval
4. Scheduler posts immediately
5. Analyzer monitors virality

## Content Templates

See `/templates/content-templates.json` for platform-specific content structures and best practices.

## Integration Points

- **Linear**: Task tracking and campaign management
- **Build Vault**: AI insights and podcast content
- **Twitter API**: Direct posting capabilities (via MCP)

## Best Practices

1. **Always start with the orchestrator** for complex workflows
2. **Use specific agents directly** for focused tasks
3. **Review content before scheduling** for brand safety
4. **Monitor analytics regularly** for optimization
5. **Maintain templates** for consistency

## Performance Optimization

- Batch similar tasks together
- Use parallel agent execution when possible
- Cache research results for reuse
- Schedule during optimal time windows
- Regular performance reviews

## Error Handling

The system includes robust error handling:
- Automatic retries for transient failures
- Graceful degradation for missing data
- Human escalation for critical issues
- Comprehensive audit trails

## Future Enhancements

- Additional platform support (TikTok, Reddit)
- Advanced AI-powered optimization
- Real-time engagement monitoring
- Automated A/B testing
- Predictive content performance

---

This refactored system maintains all the functionality of the original LangGraph implementation while leveraging Claude Code's native capabilities for improved simplicity and reliability.