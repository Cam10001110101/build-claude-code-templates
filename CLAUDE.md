# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a template repository for building Claude Code sub agent teams. It contains multiple collections of specialized AI agents organized by use case, along with comprehensive documentation on agent development patterns.

## Key Architecture

### Sub Agent Teams

The repository showcases five main agent team implementations:

1. **Build Prep Team** (`/.claude/agents/build-prep-team/`)
   - Podcast production and research agents
   - Social media content creation
   - SEO optimization
   - Market research capabilities

2. **Obsidian Ops Team** (`/.claude/agents/obsidian-ops-team/`)
   - Vault enhancement system with 5 specialized agents
   - Python automation scripts in `/Scripts/`
   - Handles metadata, connections, tags, MOCs, and reviews

3. **OCR Extraction Team** (`/.claude/agents/ocr-extraction-team/`)
   - Multi-stage OCR processing pipeline
   - Text extraction, grammar fixing, markdown formatting
   - Quality assurance and validation

4. **Open Deep Research Team** (`/.claude/agents/open-deep-research-team/`)
   - Academic and technical research capabilities
   - Query clarification and research coordination
   - Report synthesis and generation

5. **Example Agents** (`/.claude/agents/example-agents/`)
   - Basic agent templates (code reviewer, debugger, data scientist)

### Agent Structure

Each agent follows a standard format:
- YAML frontmatter with `name`, `description`, and `tools`
- Detailed system prompt defining capabilities and workflow
- Specific tool permissions for focused functionality

## Common Development Tasks

### Working with Sub Agents

- View all agents: `/agents`
- Test an agent: `@agent-name perform task`
- Create new agent: Use `/agents` command or create `.md` file in appropriate team folder

### Agent Orchestration Patterns

The repository demonstrates several orchestration patterns:
- Parallel execution (Obsidian Ops Team)
- Sequential pipelines (OCR Extraction Team)
- Hierarchical coordination (Research Team)
- Event-driven workflows (Build Prep Team)

## Important Conventions

### Agent Naming
- Use lowercase with hyphens (e.g., `metadata-agent`)
- Group related agents in team folders
- Descriptive names indicating primary function

### Tool Permissions
- Limit tools to what's necessary for the agent's role
- Common patterns:
  - Read-only agents: `Read, Grep, Glob`
  - Modification agents: `Read, Edit, Write, MultiEdit`
  - Automation agents: `Bash, Read, Write`

### Python Scripts
- Store automation scripts alongside agents (see Obsidian Ops Team)
- Use descriptive function names and docstrings
- Include error handling and progress reporting

## Architecture Insights

### Multi-Agent Collaboration
The repository demonstrates how agents can work together:
- Shared context through file outputs
- Coordinated workflows via orchestrator agents
- Parallel processing for efficiency
- Sequential validation and quality checks

### Extensibility
Each team serves as a template for building similar systems:
- Podcast team → Content production workflows
- Obsidian team → Knowledge management systems
- OCR team → Document processing pipelines
- Research team → Information synthesis workflows

## Quick Reference

- Agent configurations: `/.claude/agents/*/`
- Documentation: `/docs/`
- Python scripts: Various `/Scripts/` directories
- Main documentation hub: `/docs/anthropic-sub-agents-doc.md`