
# Template Format

This document describes the required structure and configuration for defining a subagent.

## File Structure

Each subagent is defined in a Markdown file with the following structure:

```md
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3 # Optional - inherits all tools if omitted
---

Your subagent's system prompt goes here. This can be multiple paragraphs
and should clearly define the subagent's role, capabilities, and approach
to solving problems.

Include specific instructions, best practices, and any constraints
the subagent should follow.
```

## Configuration Fields

| Field       | Required | Description                                                                                 |
|-------------|----------|---------------------------------------------------------------------------------------------|
| name        | Yes      | Unique identifier using lowercase letters and hyphens                                       |
| description | Yes      | Natural language description of the subagent's purpose                                      |
| tools       | No       | Comma-separated list of specific tools. If omitted, inherits all tools from the main thread |

## Available Tools

Subagents can be granted access to any of Claude Code's internal tools. See the tools documentation for a complete list of available tools.

You have two options for configuring tools:
1. Omit the tools field to inherit all tools from the main thread (default), including MCP tools.
2. Specify individual tools as a comma-separated list for more granular control (can be edited manually or via /agents).

### MCP Tools

Subagents can access MCP tools from configured MCP servers. When the tools field is omitted, subagents inherit all MCP tools available to the main thread.
