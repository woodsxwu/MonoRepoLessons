# TODO-PLAN.md
## Implementation Plan · Minimal Terminal Todo Manager

A phase-by-phase guide to building our MVC todo application.

---

## Development Phases

```
Foundation → Model → View → Controller → Integration → Polish
  2-3h       3-4h    4-5h     3-4h         2-3h        2-3h
```

### Phase 1: Foundation
**Goal**: Project setup and structure  
**Time**: 2-3 hours

- Initialize TypeScript project
- Install blessed and types
- Create directory structure
- Configure build pipeline

### Phase 2: Model
**Goal**: Data layer with persistence  
**Time**: 3-4 hours

```typescript
// Core deliverables
src/model/todo.ts       // ITodo interface, validation
src/model/todoList.ts   // CRUD operations
src/model/storage.ts    // JSON persistence
```

**Test**: Create, save, and reload todos from JSON

### Phase 3: View
**Goal**: Terminal UI with blessed  
**Time**: 4-5 hours

```typescript
// UI components
src/view/layout.ts      // Screen container
src/view/listPanel.ts   // Todo list (left)
src/view/detailPanel.ts // Todo details (right)
src/view/statusBar.ts   // Statistics (bottom)
```

**Test**: Render static UI with mock data

### Phase 4: Controller
**Goal**: Input handling and actions  
**Time**: 3-4 hours

```typescript
// Interaction layer
src/controller/inputHandler.ts  // Keyboard mapping
src/controller/actions.ts       // Business logic
src/controller/navigation.ts    // Focus management
```

**Test**: Navigate, create, toggle, delete todos

### Phase 5: Integration
**Goal**: Wire MVC components  
**Time**: 2-3 hours

- Connect model ↔ view ↔ controller
- Implement event flow
- Add error handling
- Create app entry point

### Phase 6: Polish
**Goal**: User experience refinement  
**Time**: 2-3 hours

- Performance optimization (<50ms startup)
- Visual feedback improvements
- Keyboard help dialog
- Final bug fixes

---

## File Structure

```
todo-manager/
├── src/
│   ├── model/          # Data and storage
│   ├── view/           # UI components
│   ├── controller/     # Input and logic
│   ├── app.ts          # Application class
│   └── index.ts        # Entry point
├── package.json
└── tsconfig.json
```

---

## Implementation Strategy

### Build Order
1. **Model first** - Easy to test, no UI dependencies
2. **View second** - Visual validation with mock data
3. **Controller third** - Wire interactions
4. **Integration last** - Connect all pieces

### Testing Approach
Each phase has a simple test:
- **Model**: Console log CRUD operations
- **View**: Render blessed UI statically
- **Controller**: Verify keyboard actions
- **Integration**: Complete user workflows

### Key Milestones
- ✓ Todos persist to JSON
- ✓ UI renders in terminal
- ✓ Keyboard navigation works
- ✓ Full CRUD operations
- ✓ Sub-50ms startup

---

## Risk Management

### Technical Risks & Mitigations

**Blessed TypeScript support**
- Risk: Incomplete type definitions
- Fix: Create custom types as needed

**Terminal compatibility**
- Risk: Rendering differences
- Fix: Test in multiple terminals, use basic features

**Large todo lists**
- Risk: Performance degradation
- Fix: Virtual scrolling, 500 item limit

**File permissions**
- Risk: Cannot write to home directory
- Fix: Fallback to current directory

---

## Quick Reference

### Time Investment
**Total**: 16-20 hours over 4 days

### Daily Schedule
- **Day 1**: Foundation + Model (5h)
- **Day 2**: View components (5h)
- **Day 3**: Controller + Integration (5h)
- **Day 4**: Polish + Testing (3h)

### Success Metrics
- Under 500 lines of code
- Less than 50ms startup
- Single file data storage
- Zero configuration

### Command Reference
```bash
npm run build   # Compile TypeScript
npm run dev     # Development mode
npm start       # Run application
```

---

## Next Steps

1. Set up TypeScript environment
2. Install dependencies: `npm i blessed @types/blessed`
3. Create `src/` directory structure
4. Begin Phase 1 implementation

Remember: Keep it simple. Resist feature creep. Ship it.

---

*A tool that does one thing well.*