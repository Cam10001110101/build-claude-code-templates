# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository is for building Claude Code sub-agent templates. Currently, the repository is in its initial state with no source code files yet implemented.

## Project Structure

The repository currently contains:
- `.claude/settings.local.json` - Local Claude Code settings with permission configurations
- `.gitattributes` - Git attributes configuration

## Development Setup

As this is a new repository without source code, specific build and development commands will need to be documented as the project evolves. When implementing the sub-agent templates, consider:

1. Documenting the template structure and format
2. Adding build/test commands once a build system is chosen
3. Providing examples of sub-agent template usage

## Claude Code Permissions

The local settings file configures permissions for Claude Code operations, currently allowing:
- `Bash(find:*)` - File discovery operations
- `Bash(ls:*)` - Directory listing operations

These permissions facilitate codebase exploration and analysis.