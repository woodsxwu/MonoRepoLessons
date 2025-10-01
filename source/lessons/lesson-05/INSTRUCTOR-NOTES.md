# Lesson 05: Instructor Notes

## 🎯 Teaching Objectives

This lesson demonstrates the evolution from tightly coupled UI testing to proper separation of concerns with model-based architecture. Students will understand both approaches and when to use each.

## 📋 Lesson Flow (90 minutes)

### Phase 1: Introduction (15 minutes)
1. **Context Setting** (5 min)
   - Review previous lessons on testing
   - Introduce the "testing evolution" concept
   - Show the simple greeting app demo

2. **Learning Objectives** (10 min)
   - Explain the two testing approaches
   - Preview what students will build
   - Set expectations for architectural thinking

### Phase 2: DOM-Based Testing (25 minutes)
1. **Live Coding** (15 min)
   - Build the simple `App.tsx` component
   - Write first DOM test together
   - Show test execution and results

2. **Student Practice** (10 min)
   - Students write additional DOM tests
   - Focus on different user interactions
   - Discuss test patterns and queries

**Key Teaching Points:**
- Emphasize user-centric thinking
- Show how tests mirror user behavior
- Point out the simplicity and directness

### Phase 3: Identifying Limitations (10 minutes)
1. **Discussion** (5 min)
   - "What happens as our app grows?"
   - "What if business logic becomes complex?"
   - "How do we test edge cases efficiently?"

2. **Demo Problems** (5 min)
   - Show slow test execution
   - Demonstrate brittle tests when UI changes
   - Highlight difficulty testing complex scenarios

### Phase 4: Model-Based Architecture (30 minutes)
1. **Architecture Introduction** (10 min)
   - Explain separation of concerns
   - Show the model interface design
   - Discuss dependency injection pattern

2. **Live Refactoring** (15 min)
   - Extract business logic to `model.ts`
   - Refactor component to use model
   - Show how architecture enables testing

3. **Testing the Model** (5 min)
   - Write pure model tests
   - Demonstrate speed and simplicity
   - Show comprehensive edge case coverage

### Phase 5: Mocked UI Testing (10 minutes)
1. **Mocking Concepts** (5 min)
   - Explain why we mock dependencies
   - Show mock creation patterns
   - Discuss isolation benefits

2. **Live Coding** (5 min)
   - Write UI tests with mocked model
   - Show interaction verification
   - Compare with DOM tests

## 🎓 Student Activities

### Activity 1: DOM Test Writing (15 minutes)
Students write tests for:
- Enter key functionality
- Empty input handling
- Multiple name updates
- Input field clearing

### Activity 2: Model Design (10 minutes)
Students design their own model interface for a different app (e.g., counter, todo item)

### Activity 3: Mock Creation (10 minutes)
Students create mocks for their designed model and write basic UI tests

## 🔍 Assessment Checkpoints

### Understanding Check 1 (After DOM Testing)
**Question:** "What are the pros and cons of testing the UI directly?"
**Expected Answer:** 
- Pros: Tests real user experience, catches integration issues
- Cons: Slower, brittle to UI changes, hard to test complex logic

### Understanding Check 2 (After Model Introduction)
**Question:** "Why separate business logic from UI logic?"
**Expected Answer:**
- Easier to test business rules
- Faster test execution
- Better maintainability
- Independent evolution of concerns

### Understanding Check 3 (After Mocking)
**Question:** "When would you use mocked vs real dependencies in tests?"
**Expected Answer:**
- Mocked: Fast unit tests, isolated component testing
- Real: Integration tests, end-to-end workflows

## 🚨 Common Student Struggles

### 1. "Why make it more complex?"
**Response:** Start with simple examples, then show how complexity grows. Emphasize that good architecture pays off over time.

### 2. "Mocking seems like cheating"
**Response:** Explain that mocking enables focused testing. Show how it complements, not replaces, integration tests.

### 3. "Which approach should I always use?"
**Response:** Emphasize context-dependent decisions. Show the decision framework from the guide.

## 🛠️ Technical Setup Notes

### Prerequisites
- Node.js 16+ installed
- Basic React knowledge
- Understanding of Jest basics

### Common Setup Issues
1. **Jest configuration:** Students may struggle with jsdom setup
2. **Import errors:** TypeScript module resolution can be tricky
3. **Mock syntax:** Jest mocking syntax is not intuitive

### Quick Fixes
```bash
# If tests don't run
npm install --save-dev @types/jest

# If DOM queries fail
npm install --save-dev @testing-library/jest-dom

# If TypeScript complains
# Add to tsconfig.json: "types": ["jest", "@testing-library/jest-dom"]
```

## 📊 Success Metrics

Students should be able to:
1. ✅ Write basic DOM tests using React Testing Library
2. ✅ Identify when DOM testing becomes problematic
3. ✅ Extract business logic into testable models
4. ✅ Create and use mocks for UI testing
5. ✅ Explain the trade-offs between approaches

## 🔄 Extension Activities

### For Advanced Students
1. **Performance Testing:** Measure and compare test execution times
2. **Coverage Analysis:** Use Jest coverage reports to compare approaches
3. **Real-World Refactoring:** Take a complex component and apply model separation

### For Struggling Students
1. **Guided Practice:** Pair programming with instructor
2. **Simplified Examples:** Start with even simpler components
3. **Visual Aids:** Draw architecture diagrams together

## 📚 Additional Resources

### For Students
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Mocking Guide](https://jestjs.io/docs/mock-functions)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### For Instructors
- [Testing Philosophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Architecture Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)

## 🎯 Key Takeaways

1. **Start Simple:** DOM testing is a great entry point
2. **Evolve Architecture:** Good testing drives good design
3. **Context Matters:** Different approaches for different situations
4. **Balance is Key:** Use both approaches strategically

---

*Remember: The goal is not to convince students that one approach is always better, but to give them tools to make informed decisions based on their specific context.*
