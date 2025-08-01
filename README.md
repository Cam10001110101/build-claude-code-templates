# Claude Code Sub-Agent Templates

A comprehensive collection of specialized AI agent teams and templates for Claude Code, demonstrating advanced orchestration patterns and multi-agent workflows.

## Overview

This repository provides battle-tested templates for building specialized Claude Code sub-agent teams. Each team showcases different orchestration patterns, from parallel processing to sequential pipelines, designed to handle complex multi-step workflows efficiently.

## What are Sub-Agents?

Sub-agents are specialized AI assistants within Claude Code that:
- Operate in separate context windows from the main conversation
- Are configured with specific tools and custom system prompts
- Handle particular types of tasks with focused expertise
- Maintain clean, specialized contexts for complex workflows

## Agent Teams

### 1. Build Prep Team (`/.claude/agents/build-prep-team/`)
Complete podcast production and content creation workflow:
- **podcast-trend-scout**: Identifies emerging tech topics
- **seo-podcast-optimizer**: Creates SEO-friendly titles and metadata
- **social-media-copywriter**: Generates social media content
- **project-supervisor-orchestrator**: Manages episode workflows

### 2. Obsidian Ops Team (`/.claude/agents/obsidian-ops-team/`)
Vault enhancement system with parallel processing:
- **metadata-agent**: Standardizes frontmatter across files
- **connection-agent**: Suggests links between related content
- **tag-agent**: Normalizes tag taxonomy
- **moc-agent**: Creates Maps of Content
- **review-agent**: Cross-checks enhancement work

### 3. OCR Extraction Team (`/.claude/agents/ocr-extraction-team/`)
Multi-stage document processing pipeline:
- **visual-analysis-ocr**: Extracts text from images
- **ocr-grammar-fixer**: Cleans OCR artifacts
- **markdown-syntax-formatter**: Formats to proper markdown
- **ocr-quality-assurance**: Validates final output

### 4. Open Deep Research Team (`/.claude/agents/open-deep-research-team/`)
Academic and technical research workflow:
- **query-clarifier**: Analyzes research queries
- **academic-researcher**: Searches scholarly sources
- **technical-researcher**: Analyzes code repositories
- **data-analyst**: Provides quantitative analysis
- **research-synthesizer**: Consolidates findings
- **report-generator**: Creates final reports

### 5. Example Agents (`/.claude/agents/example-agents/`)
Basic templates for common development tasks:
- **code-reviewer**: Code quality analysis
- **debugger**: Error troubleshooting
- **data-scientist**: Data analysis and SQL operations

## Orchestration Patterns

### Parallel Execution
```markdown
# Obsidian Ops Team
Multiple agents work simultaneously on different aspects of vault enhancement
```

### Sequential Pipeline
```markdown
# OCR Extraction Team
visual-analysis-ocr → ocr-grammar-fixer → markdown-syntax-formatter → ocr-quality-assurance
```

### Hierarchical Coordination
```markdown
# Research Team
query-clarifier coordinates with specialist researchers, then research-synthesizer consolidates
```

### Event-Driven Workflows
```markdown
# Build Prep Team
project-supervisor-orchestrator dispatches tasks based on episode data completeness
```

## Quick Start

### Using Existing Agents
1. View available agents: `/agents`
2. Invoke an agent: `@agent-name perform specific task`
3. Chain agents: Use multiple agents in sequence for complex workflows

### Creating New Agents
1. Run `/agents` command
2. Select "Create New Agent"
3. Use templates from this repository as reference
4. Configure tools and system prompt

### Agent Structure
```markdown
---
name: agent-name
description: Brief description of agent purpose
tools: Read, Edit, Write, Bash  # Minimal required tools
---

Detailed system prompt defining:
- Specific role and responsibilities
- Workflow patterns
- Output formats
- Quality standards
```

## Best Practices

### Agent Design
- **Single Responsibility**: Each agent handles one primary function
- **Minimal Tools**: Grant only necessary tool permissions
- **Clear Interfaces**: Define clear input/output formats
- **Error Handling**: Include validation and quality checks

### Team Orchestration
- **Coordinator Agents**: Use supervisor patterns for complex workflows
- **State Management**: Pass context between agents via files or structured outputs
- **Parallel Processing**: Run independent agents simultaneously
- **Validation**: Include review agents for quality control

### Tool Permissions
```markdown
# Read-only agents
tools: Read, Grep, Glob

# Modification agents  
tools: Read, Edit, Write, MultiEdit

# Automation agents
tools: Bash, Read, Write

# Full access orchestrators
tools: "*"
```

## Architecture Insights

### Context Management
- Each sub-agent maintains isolated context
- Main conversation stays focused on coordination
- Complex tasks broken into manageable chunks

### Reusability
- Agents work across different projects
- Template patterns apply to various domains
- Modular design enables mix-and-match approaches

### Scalability
- Add new agents without affecting existing ones
- Parallel execution improves performance
- Hierarchical patterns handle complexity

## Documentation

- **Main Guide**: `/docs/anthropic-sub-agents-doc.md`
- **Agent Configurations**: `/.claude/agents/*/`
- **Python Scripts**: Various `/Scripts/` directories
- **Project Setup**: `/CLAUDE.md`

## Example Workflows

### Content Production (Build Prep Team)
```markdown
1. podcast-trend-scout identifies topics
2. seo-podcast-optimizer creates metadata
3. social-media-copywriter generates promotional content
4. project-supervisor-orchestrator coordinates delivery
```

### Knowledge Enhancement (Obsidian Ops Team)
```markdown
1. All agents run in parallel on vault sections
2. metadata-agent standardizes frontmatter
3. connection-agent suggests linking opportunities
4. tag-agent normalizes taxonomy
5. review-agent validates changes
```

### Document Processing (OCR Team)
```markdown
1. visual-analysis-ocr extracts text from image
2. ocr-grammar-fixer cleans extraction errors  
3. markdown-syntax-formatter applies proper formatting
4. ocr-quality-assurance validates against original
```

## Contributing

This repository serves as a living template collection. Each team demonstrates different patterns that can be adapted for various use cases:

- **Podcast team** → Content production workflows
- **Obsidian team** → Knowledge management systems  
- **OCR team** → Document processing pipelines
- **Research team** → Information synthesis workflows

## License

Template patterns and configurations in this repository are provided as examples for building Claude Code sub-agent systems.