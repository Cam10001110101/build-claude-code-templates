# Sub-Agent JSON Mapping Guide

This document explains how each sub-agent interprets and processes the Song Creation JSON format. Each agent focuses on specific sections while maintaining awareness of the overall composition.

## Sub-Agent Processing Overview

### 1. Producer (ableton-producer)
**Receives:** Entire JSON document
**Primary Focus:** Overall coordination and vision
**Responsibilities:**
- Parse and validate complete JSON
- Distribute relevant sections to other agents
- Resolve conflicts between agent suggestions
- Ensure coherent final production
- Make executive decisions on creative direction

**Key Sections:**
- All sections (oversight role)
- `creativeDirectives` (primary interpreter)
- `productionStyle` (overall guidance)

### 2. Genre Specialist (ableton-genre-specialist)
**Primary Sections:**
```json
{
  "productionStyle.genre": {...},
  "productionStyle.reference": {...}
}
```
**Responsibilities:**
- Ensure genre authenticity based on `authenticity` parameter
- Suggest genre-appropriate instrumentation
- Guide production choices for era accuracy
- Recommend reference-based decisions

### 3. Music Theory Expert (ableton-theory-expert)
**Primary Sections:**
```json
{
  "songMetadata.key": "...",
  "songMetadata.timeSignature": "...",
  "harmony": {...}
}
```
**Responsibilities:**
- Validate harmonic progressions
- Ensure proper voice leading
- Suggest chord substitutions
- Guide modulation strategies
- Verify scale/mode consistency

### 4. Melody Maker (ableton-melody-maker)
**Primary Sections:**
```json
{
  "melody": {...},
  "harmony.progressions": {...},
  "songMetadata.key": "..."
}
```
**Responsibilities:**
- Create melodic lines based on specifications
- Ensure melodic contour matches description
- Apply ornamentation appropriately
- Implement call-response patterns
- Work within specified range

### 5. Harmony Expert (ableton-harmony-expert)
**Primary Sections:**
```json
{
  "harmony": {...},
  "instrumentation.harmonic": {...}
}
```
**Responsibilities:**
- Implement chord voicings
- Create voice leading
- Apply extensions and alterations
- Coordinate with bass for root movement
- Ensure harmonic rhythm consistency

### 6. Drummer (ableton-drummer)
**Primary Sections:**
```json
{
  "instrumentation.drums": {...},
  "arrangement.structure": [...],
  "performance.groove": {...}
}
```
**Responsibilities:**
- Create drum patterns per section
- Implement specified drum elements
- Apply processing style
- Manage intensity changes
- Execute groove templates

### 7. Bassist (ableton-bassist)
**Primary Sections:**
```json
{
  "instrumentation.bass": {...},
  "harmony.progressions": {...},
  "performance.groove": {...}
}
```
**Responsibilities:**
- Create bass lines matching style
- Follow harmonic progressions
- Implement articulations
- Apply sidechain if specified
- Lock with drum groove

### 8. Synth Lead (ableton-synth-lead)
**Primary Sections:**
```json
{
  "instrumentation.melodic.leadSynth": {...},
  "melody": {...},
  "production.soundDesign": {...}
}
```
**Responsibilities:**
- Design lead synth patches
- Play melodic lines
- Apply specified effects
- Follow section assignments
- Create memorable hooks

### 9. Synth Pad (ableton-synth-pad)
**Primary Sections:**
```json
{
  "instrumentation.harmonic.synthPad": {...},
  "harmony": {...},
  "production.mixing.width": {...}
}
```
**Responsibilities:**
- Create pad textures
- Implement chord voicings
- Apply movement/modulation
- Manage stereo width
- Support harmonic foundation

### 10. Strings Arranger (ableton-strings)
**Primary Sections:**
```json
{
  "instrumentation.harmonic.strings": {...},
  "arrangement.structure": [...],
  "productionStyle.mood": {...}
}
```
**Responsibilities:**
- Arrange string sections
- Create dynamics/swells
- Support emotional arc
- Follow section assignments
- Blend with other harmonic elements

### 11. Horn Section (ableton-horns)
**Primary Sections:**
```json
{
  "instrumentation.harmonic.horns": {...},
  "productionStyle.genre": {...},
  "arrangement.structure": [...]
}
```
**Responsibilities:**
- Arrange horn sections
- Create punchy articulations
- Follow genre conventions
- Add energy to specified sections
- Coordinate with rhythm section

### 12. Sound Designer (ableton-sound-designer)
**Primary Sections:**
```json
{
  "production.soundDesign": {...},
  "arrangement.dropMoments": [...],
  "creativeDirectives.standoutMoments": [...]
}
```
**Responsibilities:**
- Create all transition effects
- Design atmospheric elements
- Build risers and impacts
- Add textural layers
- Enhance key moments

### 13. Automation Specialist (ableton-automation)
**Primary Sections:**
```json
{
  "production.automation": {...},
  "arrangement.structure": [...],
  "evolution": {...}
}
```
**Responsibilities:**
- Implement all automation curves
- Create dynamic movement
- Execute buildups
- Apply time-based evolution
- Enhance arrangement dynamics

### 14. Mixing Engineer (ableton-mixing-engineer)
**Primary Sections:**
```json
{
  "production.mixing": {...},
  "instrumentation": {...},
  "performance.humanization": {...}
}
```
**Responsibilities:**
- Balance all elements
- Apply spatial processing
- Implement EQ strategies
- Create depth with reverb/delay
- Ensure translation

### 15. Mastering Engineer (ableton-mastering-engineer)
**Primary Sections:**
```json
{
  "production.mastering": {...},
  "productionStyle.reference": {...},
  "songMetadata": {...}
}
```
**Responsibilities:**
- Apply final processing chain
- Meet loudness targets
- Enhance specified characteristics
- Ensure platform optimization
- Preserve dynamic intent

### 16. Sampler/Beat Chopper (ableton-sampler)
**Primary Sections:**
```json
{
  "sampling": {...},
  "instrumentation.drums": {...},
  "productionStyle.genre": {...}
}
```
**Responsibilities:**
- Process sample sources
- Create chopped elements
- Apply era-appropriate processing
- Integrate with drums
- Maintain legal awareness

### 17. Vocal Producer (ableton-vocal-producer)
**Primary Sections:**
```json
{
  "vocals": {...},
  "melody": {...},
  "productionStyle.mood": {...}
}
```
**Responsibilities:**
- Guide vocal performance
- Apply vocal processing
- Create harmonies
- Manage lyrics/phrasing
- Ensure emotional delivery

## Execution Flow

### Phase 1: Analysis
1. Producer receives and validates JSON
2. Producer distributes to specialists
3. Each agent analyzes their sections

### Phase 2: Planning
1. Theory Expert validates harmonic framework
2. Genre Specialist confirms stylistic choices
3. Agents report back to Producer

### Phase 3: Creation
1. Rhythm section (Drums, Bass) establishes foundation
2. Harmonic elements (Pads, Strings, Horns) build texture
3. Melodic elements (Lead, Vocals) add focus
4. Sound Designer adds transitions

### Phase 4: Production
1. Automation Specialist adds movement
2. Mixing Engineer balances elements
3. Mastering Engineer finalizes

## Conflict Resolution

When agents have conflicting interpretations:

1. **Producer Priority**: Producer makes final decisions
2. **Genre Weight**: Higher `authenticity` gives Genre Specialist more weight
3. **Section Context**: Agent responsible for section has priority
4. **Creative Freedom**: Lower `authenticity` allows more experimentation

## Communication Protocol

Agents communicate through the Producer using structured messages:

```json
{
  "agent": "ableton-drummer",
  "section": "chorus",
  "suggestion": "...",
  "confidence": 0.8,
  "conflicts": ["bass pattern overlap"],
  "requires": ["bass confirmation"]
}
```

## Advanced Features Handling

### Conditionals
Agents check conditions before applying instructions:
```json
if (section === "bridge" && conditionals.if_section_bridge) {
  applyConditionalInstructions(conditionals.if_section_bridge);
}
```

### Evolution
Time-based changes are coordinated by Automation Specialist:
```json
evolution["0:30-1:00"].add.forEach(element => {
  notifyAgent(element, "prepare for entry at 0:30");
});
```

### Variations
Probabilistic elements are decided by Producer:
```json
if (Math.random() < variation.drumFills.probability) {
  drummer.addFill(variation.drumFills.complexity);
}
```

## Best Practices

1. **Respect Hierarchies**: Follow the execution flow order
2. **Communicate Conflicts**: Report issues to Producer
3. **Maintain Context**: Consider the full arrangement
4. **Balance Creativity**: Respect both instructions and musicality
5. **Document Decisions**: Log why choices were made

This mapping ensures each sub-agent contributes their expertise while maintaining a coherent, unified production that realizes the creative vision specified in the JSON.