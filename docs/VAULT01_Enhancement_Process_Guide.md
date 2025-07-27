## Overview

Five specialized AI agents work in parallel to:
- Ensure consistent metadata across all files
- Discover hidden connections between notes
- Standardize and organize tags
- Generate navigation structures (Maps of Content)
- Review and validate all changes

## The Agent Team

### 1. Metadata Agent (`metadata-agent`)
**Purpose**: Ensures every file has proper frontmatter metadata

**Responsibilities**:
- Scans all markdown files for missing frontmatter
- Adds standardized metadata structure including:
  - Tags (based on directory structure)
  - Type (note, reference, moc, etc.)
  - Creation/modification dates
  - Status (active, archive, draft)
  - Related files and aliases arrays
- Maintains 100% metadata compliance

**Tools Used**: 
- Python script: `metadata_adder.py`
- Filesystem analysis for date extraction
- Directory-based tag generation

### 2. Connection Agent (`connection-agent`)
**Purpose**: Discovers potential links between related content

**Responsibilities**:
- Analyzes all notes for entity mentions (people, companies, technologies)
- Identifies keyword overlap between documents
- Finds orphaned notes with no connections
- Generates comprehensive link suggestion reports
- Prioritizes connections by confidence and value

**Discovery Methods**:
- Entity extraction (names, products, companies)
- Semantic similarity analysis
- Common keyword identification
- Directory proximity considerations

**Tools Used**:
- Python script: `link_suggester.py`
- Natural language processing for entity recognition
- Keyword frequency analysis

### 3. Tag Agent (`tag-agent`)
**Purpose**: Maintains a clean, hierarchical tag taxonomy

**Responsibilities**:
- Normalizes technology names (e.g., "langchain" → "LangChain")
- Applies hierarchical structure (e.g., "ai/agents", "business/strategy")
- Consolidates duplicate and similar tags
- Ensures consistent formatting
- Generates tag analysis reports

**Standardization Rules**:
- Maximum 3-level hierarchy
- Forward slashes for categories
- Proper case for product names
- Hyphens for multi-word tags

**Tools Used**:
- Python script: `tag_standardizer.py`
- PyYAML for frontmatter manipulation
- Taxonomy mapping system

### 4. MOC Agent (`moc-agent`)
**Purpose**: Creates and maintains Maps of Content for navigation

**Responsibilities**:
- Identifies directories without MOCs
- Generates MOCs using standardized templates
- Organizes orphaned images into galleries
- Updates master navigation structures
- Ensures all content is discoverable

**MOC Standards**:
- Centralized in `/map-of-content/` directory
- Named as "MOC - [Topic].md"
- Includes overview, resources, and connections
- Links bidirectionally with content

**Tools Used**:
- Python script: `moc_generator.py`
- Template-based generation
- Directory structure analysis

### 5. Review Agent (`review-agent`)
**Purpose**: Quality assurance and validation

**Responsibilities**:
- Validates all changes made by other agents
- Checks for consistency across enhancements
- Identifies potential issues or conflicts
- Generates vault maturity score
- Provides actionable recommendations

**Review Checklist**:
- Metadata compliance
- Connection relevance
- Tag hierarchy adherence
- MOC completeness
- Overall vault health metrics

## The Enhancement Workflow

### 1. Trigger Phase
User says: **"Run vault enhancement"** or **"Enhance my vault"**

### 2. Orchestration Phase
Claude Code:
1. Loads all five sub-agent configurations from `.claude/agents/`
2. Creates a todo list for tracking progress
3. Invokes agents in parallel for efficiency

### 3. Execution Phase
Each agent independently:
1. Analyzes their specific domain
2. Runs their specialized Python scripts
3. Makes necessary changes
4. Generates reports

### 4. Review Phase
The review agent:
1. Validates all changes
2. Checks cross-agent consistency
3. Calculates vault maturity score
4. Identifies any issues

### 5. Reporting Phase
System generates:
1. Individual agent reports
2. Consolidated enhancement report
3. Actionable recommendations
4. Success metrics

## Technical Implementation

### Sub-Agent Configuration
Each agent is defined in `.claude/agents/` with:
```markdown
---
name: agent-name
description: When this agent should be invoked
tools: Read, Write, Bash, Grep, etc.
---

Detailed system prompt defining role and capabilities...
```

## Use Cases

### Regular Maintenance (Monthly)
Run full enhancement to:
- Add metadata to new files
- Update connection suggestions
- Standardize new tags
- Generate missing MOCs

### Targeted Improvements
Invoke specific agents:
- `@metadata-agent` for new file batches
- `@connection-agent` after research sessions
- `@tag-agent` when adding new topics
- `@moc-agent` for navigation updates

### Quality Checks
- `@review-agent` for vault health assessment
- Generate reports for manual review
- Track improvement over time

## Getting Started

### First Run
1. Say "Run vault enhancement"
2. Review generated reports
3. Implement high-priority suggestions
4. Schedule regular maintenance

## Advanced Features

### Custom Agents
Create new agents for specific needs:
- Research paper analyzer
- Meeting notes processor
- Project documentation builder
- Client work organizer


---
