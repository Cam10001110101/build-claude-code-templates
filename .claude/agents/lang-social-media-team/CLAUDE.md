# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Agent Testing
```bash
# Test a specific agent
@agent-name perform task

# List all available agents
/agents

# Test the full workflow
@workflow-orchestrator start social media campaign
```

### Content Generation
```bash
# Generate content from URL
@content-creator create posts from [URL]

# Research current trends
@content-researcher find trending AI topics

# Analyze performance
@social-media-analyzer generate monthly report

# Schedule posts
@social-media-scheduler queue content for publication
```

## High-Level Architecture

This is a **Claude Code sub-agent team** that converts URLs into social media posts using native Claude Code tools and file-based coordination. The system has been refactored from LangGraph to use Claude Code's agent architecture.

### Core Agent Team Structure

The system consists of **6 specialized agents** working together:

1. **workflow-orchestrator** - Coordinates the entire social media workflow
2. **content-researcher** - Researches trends and gathers source material
3. **content-creator** - Generates platform-specific social media content
4. **social-media-scheduler** - Manages posting timing and coordination
5. **social-media-analyzer** - Analyzes performance and provides insights
6. **social-media-reviewer** - Quality assurance and brand compliance

### Agent Architecture Pattern

Each agent follows a consistent Claude Code structure:
- YAML frontmatter with `name`, `description`, and `tools`
- Detailed system prompt defining capabilities and workflows
- Specific tool permissions for focused functionality
- JSON input/output structures for file-based coordination

### Data Flow

1. **URL Input** → Content extraction via WebFetch
2. **Research Phase** → Trend analysis and competitive intelligence via WebSearch
3. **Content Generation** → Multi-platform post creation using native LLM capabilities
4. **Quality Review** → Brand compliance and optimization checks
5. **Scheduling** → Optimal timing and cross-platform coordination
6. **Analytics** → Performance tracking and insights generation

### Key Components

#### Native Tool Integration
- **Read/Write**: File-based agent coordination and data persistence
- **WebFetch/WebSearch**: Content research and trend analysis
- **Task**: Sub-agent invocation and workflow orchestration
- **TodoWrite**: Progress tracking and task management
- **MCP Tools**: Platform-specific integrations (Twitter, URL validation)

#### File-Based Coordination
- **Input Files**: Research data, source URLs, content briefs
- **Output Files**: Generated posts, analytics reports, scheduling plans
- **Shared Data**: Brand guidelines, performance benchmarks, templates
- **Status Tracking**: Progress files, error logs, approval workflows

#### Platform Integration
- **Native Claude Code Tools**: Replace complex LangGraph dependencies
- **MCP Server Integration**: Twitter posting, URL validation, analytics
- **Simplified Authentication**: Direct API integration without Arcade complexity
- **Multi-platform Support**: Twitter, LinkedIn, Instagram, Reddit

### Integration Points

#### File-Based Agent Communication
```json
{
  "workflow": {
    "orchestrator": "workflow-orchestrator.md",
    "input_files": ["research-output.json", "content-brief.json"],
    "output_files": ["final-posts.json", "analytics-report.json"],
    "coordination": "sequential_with_parallel_optimization"
  }
}
```

#### Agent Responsibilities
- **Orchestrator**: Workflow management, agent coordination, progress tracking
- **Researcher**: Trend analysis, competitive intelligence, source validation
- **Creator**: Content generation, platform adaptation, brand alignment
- **Scheduler**: Timing optimization, queue management, publication coordination
- **Analyzer**: Performance tracking, insights generation, optimization recommendations
- **Reviewer**: Quality assurance, compliance checking, final approval

### Workflow Examples

#### Standard Content Generation
1. Orchestrator receives URL and campaign requirements
2. Researcher analyzes trends and gathers contextual information
3. Creator generates platform-specific content variations
4. Reviewer validates quality, brand compliance, and optimization
5. Scheduler determines optimal posting times and coordinates publication
6. Analyzer tracks performance and generates insights

#### Urgent Content Publishing
1. Orchestrator prioritizes urgent content request
2. Creator generates time-sensitive posts with expedited review
3. Reviewer performs critical compliance checks only
4. Scheduler executes immediate publication across platforms
5. Analyzer monitors real-time performance and engagement

### Configuration & Customization

#### Agent Configuration
- Agent definitions in `.claude/agents/lang-social-media-team/agents/`
- Tool permissions customizable per agent role
- Brand guidelines and templates in shared reference files
- Platform-specific formatting rules and constraints

#### Content Templates
- Post format templates for each platform
- Brand voice and tone guidelines
- Hashtag strategies and mention protocols
- Visual content specifications and requirements

#### Performance Optimization
- Optimal posting time calculations
- Engagement rate benchmarking
- Content type performance analysis
- Cross-platform coordination strategies

## Development Notes

### Environment Setup
- Claude Code CLI required for agent testing
- Native tool integration (no external dependencies)
- MCP server configuration for platform integrations
- File-based workflow coordination

### Agent Testing Patterns
- Use `@agent-name` syntax to test individual agents
- File-based input/output validation
- Progress tracking via TodoWrite integration
- Error handling and recovery workflows

### Customization Points
- **Agent Prompts** - Modify system prompts in individual agent files
- **Brand Guidelines** - Update shared reference files for consistency
- **Platform Rules** - Adjust platform-specific formatting and constraints
- **Workflow Logic** - Modify orchestrator coordination patterns

### Performance Considerations
- **Parallel Processing** - Multiple agents can work simultaneously on different tasks
- **File Caching** - Reuse research and analysis data across workflow runs
- **Rate Limiting** - Built into MCP server integrations
- **Error Recovery** - Each agent handles failures independently with fallback strategies

### Migration from LangGraph
This system has been refactored from a complex LangGraph-based architecture to use Claude Code's native agent system:
- **Simplified Dependencies**: No LangGraph, LangSmith, or complex state management
- **Native Tools**: Uses Claude Code's built-in Read, Write, WebFetch, WebSearch tools
- **File Coordination**: Replaces LangGraph state with JSON file coordination
- **Agent Specialization**: Each agent has focused responsibilities and clear interfaces
- **Improved Maintainability**: Standard Claude Code patterns and documentation