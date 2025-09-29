# TODO-DESIGN.md
## Minimal Terminal Todo Manager - Design Document

A personal todo manager built with blessed and TypeScript. Small, fast, and beautiful.

---

## 1. System Architecture Overview

### MVC Architecture

The application uses a simplified Model-View-Controller pattern with direct communication between components.

#### Component Responsibilities

**Model**
- Maintains todo list in memory
- Handles CRUD operations on todos
- Persists data to JSON file
- Auto-saves on every modification

**View** 
- Renders terminal UI using blessed
- Manages two-panel layout (list and detail)
- Handles screen refresh and resizing
- Displays status information

**Controller**
- Captures user input events
- Translates interactions to model operations
- Coordinates view updates
- Manages application lifecycle

#### Component Interaction Diagram

```
┌────────────────────────────────────────┐
│           Application Start            │
└────────────────┬───────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Controller   │
         │               │
         │ Coordinates   │
         │   between:    │
         └───┬───────┬───┘
             │       │
    ┌────────▼──┐ ┌──▼────────┐
    │   Model   │ │   View    │
    │           │ │           │
    │ Data &    │ │ Terminal  │
    │ Storage   │ │ Rendering │
    └───────────┘ └───────────┘
```

#### Data Flow

1. **User Input → Controller**: User interactions captured and interpreted
2. **Controller → Model**: Operations performed on todo data
3. **Model → Storage**: Changes persisted to disk automatically
4. **Controller → View**: UI updated to reflect new state
5. **View → Terminal**: Blessed renders to terminal screen

---

## 2. User Interface Design

### Terminal UI Layout

```
┌─────────────────────────────────────────────────────┐
│  my todos                                            │
├─────────────────────────────────────────────────────┤
│                        │                             │
│  Todo List Panel       │  Detail Panel               │
│  ----------------      │  -------------              │
│                        │                             │
│  ☐ Buy coffee          │  Title: Write docs          │
│  ☐ Fix that bug        │                             │
│  ☑ Call mom            │  Created: Today 9:00 AM     │
│ ▶☐ Write docs          │  Due: Tomorrow              │
│  ☐ Read book           │                             │
│  ☐ Plan vacation       │  Notes:                     │
│                        │  Update the API docs for    │
│                        │  the new auth endpoint.     │
│                        │  Include examples.          │
│                        │                             │
├────────────────────────┴─────────────────────────────┤
│ 5 todos · 1 done                                     │
└───────────────────────────────────────────────────────┘
```

### Panel Descriptions and Responsibilities

#### Todo List Panel (Left, 50% width)
**Purpose**: Display and navigate todos
- Shows completion status with checkboxes (☐/☑)
- Indicates current selection with arrow (▶)
- Displays todo title only
- Scrollable when list exceeds viewport
- Updates immediately on any change

#### Detail Panel (Right, 50% width)
**Purpose**: Show extended information for selected todo
- Displays full todo title
- Shows creation date and due date if set
- Renders notes/description if present
- Updates when selection changes
- Empty when no todos exist

#### Status Bar (Bottom, full width)
**Purpose**: Provide context information
- Shows todo statistics (total and completed count)
- Fixed single line height
- Always visible

### Navigation and Interaction Patterns

#### Focus Management
- Tab-based navigation between panels
- Visual focus indicators on active panel
- Automatic focus return after actions

#### Input Handling
- Form-based input for new todos
- In-place editing for existing todos
- Immediate feedback for all actions
- Confirmation dialogs for destructive operations

#### Visual Feedback
- Color coding for different states (completed, overdue)
- Smooth transitions on state changes
- Clear selection indicators
- Loading states for file operations

---

## 3. Data Model Specification

### Todo Item Structure and Properties

#### Core Fields
- **id**: Unique identifier (8-character random string)
- **text**: Todo title/description (required, max 200 characters)
- **done**: Completion status (boolean)
- **created**: Creation timestamp (Date)

#### Optional Fields
- **due**: Due date (Date, optional)
- **note**: Extended description (string, optional, max 1000 characters)

### Data Validation Rules

#### Text Validation
- Required field, cannot be empty
- Maximum 200 characters
- Trimmed of leading/trailing whitespace
- No control characters allowed

#### Date Validation
- Created date set automatically on creation
- Due date must be valid Date object if provided
- No validation for past due dates (just display differently)

#### ID Generation
- 8 characters from alphanumeric set
- Generated on creation
- Immutable after creation
- Guaranteed unique within collection

### Storage Format and Persistence Strategy

#### File Location
- Primary location: Home directory as .todos.json
- No backup files (simplicity over safety)
- User-readable JSON format

#### JSON Structure
The data is stored as a simple JSON object containing a version identifier and an array of todo objects. Each todo contains its id, text, completion status, creation date, and optional fields for due date and notes.

#### Persistence Strategy
- Load entire file on startup
- Keep all todos in memory during operation
- Save entire file on every modification
- No partial updates or append operations
- Synchronous writes (acceptable for personal use)
- No locking or multi-process safety needed

---

## 4. Technical Requirements

### Dependencies and Libraries

#### Production Dependencies
- **blessed** (v0.1.81): Terminal UI framework providing box model, rendering, input handling, and terminal capability management

#### Development Dependencies
- **TypeScript** (v5.2+): Type safety and better IDE support
- **Node.js type definitions**: Type support for Node.js APIs
- **Blessed type definitions**: Type support for blessed library

### Performance Considerations

#### Startup Performance
- Target: Less than 50ms to interactive
- Load todos synchronously (acceptable for under 1000 items)
- Render initial UI immediately
- No splash screen or loading indicator

#### Runtime Performance
- Instant response to user actions (under 16ms)
- No debouncing for navigation
- Synchronous file writes (under 10ms for typical use)
- Full re-render on each change (blessed handles optimization)

### Design Constraints

#### Simplicity Constraints
- No configuration file
- No command-line arguments
- No environment variables
- No external integrations
- No network features

#### Size Constraints
- Total codebase: Under 500 lines
- Single binary output
- No runtime dependencies except blessed
- Bundle size: Under 1MB

#### User Experience Constraints
- Minimal learning curve
- No manual needed for basic operations
- No customization options
- Opinionated design decisions

---

## Implementation Notes

### File Organization
The project consists of four main TypeScript modules:
- Entry point and initialization module
- Todo data model and storage module
- Blessed UI components module
- Input and action handling module

Plus standard configuration files for TypeScript and npm package management.

### Future Considerations
These features are intentionally excluded:
- Projects or categories
- Tags or labels
- Priority levels
- Recurring todos
- Reminders or notifications
- Sync or backup
- Themes or customization
- Plugins or extensions

---

*This design prioritizes simplicity and speed over features. It's a tool that does one thing well: manage a simple todo list in the terminal.*