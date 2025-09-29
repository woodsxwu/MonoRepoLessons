import * as blessed from 'blessed';
import { BlessedTodoUI } from '../src/blessed_todo';
import { TodoList, Priority } from '../src/todo';

// Mock blessed to avoid actual screen rendering in tests
jest.mock('blessed');

describe('BlessedTodoUI', () => {
  let mockScreen: any;
  let mockList: any;
  let mockForm: any;
  let mockTextbox: any;
  let mockButton: any;
  let todoList: TodoList;
  let ui: BlessedTodoUI;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock blessed components
    mockScreen = {
      render: jest.fn(),
      destroy: jest.fn(),
      key: jest.fn(),
      on: jest.fn(),
      append: jest.fn(),
      focus: jest.fn()
    };
    
    mockList = {
      setItems: jest.fn(),
      getItem: jest.fn(),
      selected: 0,
      on: jest.fn(),
      focus: jest.fn(),
      select: jest.fn()
    };
    
    mockForm = {
      on: jest.fn(),
      reset: jest.fn(),
      submit: jest.fn()
    };
    
    mockTextbox = {
      getValue: jest.fn(),
      setValue: jest.fn(),
      focus: jest.fn(),
      on: jest.fn()
    };
    
    mockButton = {
      on: jest.fn(),
      focus: jest.fn()
    };

    // Mock blessed constructors
    (blessed.screen as jest.Mock).mockReturnValue(mockScreen);
    (blessed.list as jest.Mock).mockReturnValue(mockList);
    (blessed.form as jest.Mock).mockReturnValue(mockForm);
    (blessed.textbox as jest.Mock).mockReturnValue(mockTextbox);
    (blessed.button as jest.Mock).mockReturnValue(mockButton);

    todoList = new TodoList();
    ui = new BlessedTodoUI(todoList);
  });

  describe('UI Initialization', () => {
    // User Story: As a user, I want to view all my tasks in one place so that I can see everything I need to do.
    
    describe('Happy Path', () => {
      test('should create screen and UI components', () => {
        expect(blessed.screen).toHaveBeenCalledWith({
          smartCSR: true,
          title: 'Todo List Manager'
        });
        expect(blessed.list).toHaveBeenCalled();
        expect(blessed.form).toHaveBeenCalled();
        expect(mockScreen.append).toHaveBeenCalled();
      });

      test('should set up keyboard shortcuts', () => {
        expect(mockScreen.key).toHaveBeenCalledWith(['escape', 'q', 'C-c'], expect.any(Function));
        expect(mockScreen.key).toHaveBeenCalledWith(['n'], expect.any(Function));
        expect(mockScreen.key).toHaveBeenCalledWith(['d'], expect.any(Function));
        expect(mockScreen.key).toHaveBeenCalledWith(['space'], expect.any(Function));
      });

      test('should render initial empty task list', () => {
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([]);
        expect(mockScreen.render).toHaveBeenCalled();
      });
    });

    describe('Edge Cases', () => {
      test('should handle screen creation failure gracefully', () => {
        (blessed.screen as jest.Mock).mockImplementation(() => {
          throw new Error('Screen creation failed');
        });
        
        expect(() => new BlessedTodoUI(todoList)).toThrow('Screen creation failed');
      });

      test('should handle missing blessed components', () => {
        (blessed.list as jest.Mock).mockReturnValue(null);
        
        expect(() => new BlessedTodoUI(todoList)).toThrow('Failed to create UI components');
      });
    });

    describe('Error Handling', () => {
      test('should throw error for null todo list', () => {
        expect(() => new BlessedTodoUI(null as any)).toThrow('TodoList cannot be null');
      });

      test('should throw error for undefined todo list', () => {
        expect(() => new BlessedTodoUI(undefined as any)).toThrow('TodoList cannot be null');
      });
    });
  });

  describe('Task Display', () => {
    // User Story: As a user, I want to view all my tasks in one place so that I can see everything I need to do.
    
    describe('Happy Path', () => {
      test('should display tasks in the list', () => {
        todoList.addTask('Task 1');
        todoList.addTask('Task 2');
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Task 1',
          '[ ] Task 2'
        ]);
      });

      test('should show completed tasks with checkmarks', () => {
        const task1 = todoList.addTask('Incomplete task');
        const task2 = todoList.addTask('Complete task');
        todoList.completeTask(task2.id);
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Incomplete task',
          '[✓] Complete task'
        ]);
      });

      test('should display task priorities', () => {
        todoList.addTask('High priority', { priority: Priority.HIGH });
        todoList.addTask('Medium priority', { priority: Priority.MEDIUM });
        todoList.addTask('Low priority', { priority: Priority.LOW });
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] [HIGH] High priority',
          '[ ] [MED] Medium priority',
          '[ ] [LOW] Low priority'
        ]);
      });

      test('should display task categories', () => {
        todoList.addTask('Work task', { category: 'Work' });
        todoList.addTask('Personal task', { category: 'Personal' });
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Work task (Work)',
          '[ ] Personal task (Personal)'
        ]);
      });

      test('should display due dates', () => {
        const dueDate = new Date('2024-12-31');
        todoList.addTask('Task with deadline', { dueDate });
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Task with deadline [Due: 2024-12-31]'
        ]);
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty task list', () => {
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([]);
      });

      test('should handle very long task titles', () => {
        const longTitle = 'A'.repeat(100);
        todoList.addTask(longTitle);
        
        ui.refreshTaskList();
        
        const expectedDisplay = `[ ] ${longTitle.substring(0, 50)}...`;
        expect(mockList.setItems).toHaveBeenCalledWith([expectedDisplay]);
      });

      test('should handle tasks with special characters', () => {
        todoList.addTask('Task with émojis 🎉 and spëcial chars');
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Task with émojis 🎉 and spëcial chars'
        ]);
      });

      test('should handle overdue tasks', () => {
        const pastDate = new Date('2020-01-01');
        todoList.addTask('Overdue task', { dueDate: pastDate });
        
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Overdue task [OVERDUE: 2020-01-01]'
        ]);
      });
    });

    describe('Error Handling', () => {
      test('should handle render errors gracefully', () => {
        mockScreen.render.mockImplementation(() => {
          throw new Error('Render failed');
        });
        
        expect(() => ui.refreshTaskList()).toThrow('Failed to refresh task list');
      });

      test('should handle corrupted task data', () => {
        // Simulate corrupted task data
        const corruptedTask = { title: null, id: 'test' } as any;
        todoList.getTasks = jest.fn().mockReturnValue([corruptedTask]);
        
        expect(() => ui.refreshTaskList()).toThrow('Invalid task data');
      });
    });
  });

  describe('Task Creation', () => {
    // User Story: As a user, I want to add new tasks to my list so that I can remember what I need to accomplish.
    
    describe('Happy Path', () => {
      test('should show add task form when "n" is pressed', () => {
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('n')
        )[1];
        
        keyHandler();
        
        expect(ui.showAddTaskForm).toBeDefined();
      });

      test('should create task when form is submitted', () => {
        mockTextbox.getValue.mockReturnValue('New task');
        
        ui.handleAddTask();
        
        expect(todoList.getTasks()).toHaveLength(1);
        expect(todoList.getTasks()[0].title).toBe('New task');
      });

      test('should refresh task list after adding task', () => {
        mockTextbox.getValue.mockReturnValue('New task');
        const refreshSpy = jest.spyOn(ui, 'refreshTaskList');
        
        ui.handleAddTask();
        
        expect(refreshSpy).toHaveBeenCalled();
      });

      test('should clear form after successful task creation', () => {
        mockTextbox.getValue.mockReturnValue('New task');
        
        ui.handleAddTask();
        
        expect(mockForm.reset).toHaveBeenCalled();
      });
    });

    describe('Edge Cases', () => {
      test('should handle form submission with whitespace-only title', () => {
        mockTextbox.getValue.mockReturnValue('   ');
        
        ui.handleAddTask();
        
        expect(todoList.getTasks()).toHaveLength(0);
        expect(ui.showError).toHaveBeenCalledWith('Task title cannot be empty');
      });

      test('should handle very long task titles', () => {
        const longTitle = 'A'.repeat(1000);
        mockTextbox.getValue.mockReturnValue(longTitle);
        
        ui.handleAddTask();
        
        expect(todoList.getTasks()).toHaveLength(1);
        expect(todoList.getTasks()[0].title).toBe(longTitle);
      });

      test('should handle special characters in task title', () => {
        const specialTitle = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        mockTextbox.getValue.mockReturnValue(specialTitle);
        
        ui.handleAddTask();
        
        expect(todoList.getTasks()).toHaveLength(1);
        expect(todoList.getTasks()[0].title).toBe(specialTitle);
      });
    });

    describe('Error Handling', () => {
      test('should handle empty task title', () => {
        mockTextbox.getValue.mockReturnValue('');
        
        ui.handleAddTask();
        
        expect(todoList.getTasks()).toHaveLength(0);
        expect(ui.showError).toHaveBeenCalledWith('Task title cannot be empty');
      });

      test('should handle form component errors', () => {
        mockTextbox.getValue.mockImplementation(() => {
          throw new Error('Form error');
        });
        
        expect(() => ui.handleAddTask()).toThrow('Failed to add task');
      });

      test('should handle todo list errors', () => {
        mockTextbox.getValue.mockReturnValue('Valid task');
        todoList.addTask = jest.fn().mockImplementation(() => {
          throw new Error('TodoList error');
        });
        
        expect(() => ui.handleAddTask()).toThrow('Failed to add task');
      });
    });
  });

  describe('Task Completion', () => {
    // User Story: As a user, I want to mark tasks as complete so that I can track my progress and feel accomplished.
    
    describe('Happy Path', () => {
      test('should toggle task completion when space is pressed', () => {
        const task = todoList.addTask('Test task');
        mockList.selected = 0;
        mockList.getItem.mockReturnValue('[ ] Test task');
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        keyHandler();
        
        expect(task.completed).toBe(true);
      });

      test('should toggle completed task back to incomplete', () => {
        const task = todoList.addTask('Test task');
        todoList.completeTask(task.id);
        mockList.selected = 0;
        mockList.getItem.mockReturnValue('[✓] Test task');
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        keyHandler();
        
        expect(task.completed).toBe(false);
      });

      test('should refresh display after toggling completion', () => {
        todoList.addTask('Test task');
        mockList.selected = 0;
        const refreshSpy = jest.spyOn(ui, 'refreshTaskList');
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        keyHandler();
        
        expect(refreshSpy).toHaveBeenCalled();
      });
    });

    describe('Edge Cases', () => {
      test('should handle completion toggle with no tasks', () => {
        mockList.selected = 0;
        mockList.getItem.mockReturnValue(null);
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        expect(() => keyHandler()).not.toThrow();
      });

      test('should handle invalid selection index', () => {
        todoList.addTask('Test task');
        mockList.selected = 999;
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        expect(() => keyHandler()).not.toThrow();
      });

      test('should handle negative selection index', () => {
        todoList.addTask('Test task');
        mockList.selected = -1;
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        expect(() => keyHandler()).not.toThrow();
      });
    });

    describe('Error Handling', () => {
      test('should handle todo list completion errors', () => {
        todoList.addTask('Test task');
        mockList.selected = 0;
        todoList.completeTask = jest.fn().mockImplementation(() => {
          throw new Error('Completion failed');
        });
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('space')
        )[1];
        
        expect(() => keyHandler()).toThrow('Failed to toggle task completion');
      });
    });
  });

  describe('Task Deletion', () => {
    // User Story: As a user, I want to delete tasks from my list so that I can remove items that are no longer relevant.
    
    describe('Happy Path', () => {
      test('should delete selected task when "d" is pressed', () => {
        const task = todoList.addTask('Task to delete');
        mockList.selected = 0;
        mockList.getItem.mockReturnValue('[ ] Task to delete');
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('d')
        )[1];
        
        keyHandler();
        
        expect(todoList.getTasks()).toHaveLength(0);
      });

      test('should refresh display after deletion', () => {
        todoList.addTask('Task to delete');
        mockList.selected = 0;
        const refreshSpy = jest.spyOn(ui, 'refreshTaskList');
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('d')
        )[1];
        
        keyHandler();
        
        expect(refreshSpy).toHaveBeenCalled();
      });

      test('should delete correct task when multiple tasks exist', () => {
        todoList.addTask('Keep this');
        const taskToDelete = todoList.addTask('Delete this');
        todoList.addTask('Keep this too');
        
        mockList.selected = 1;
        mockList.getItem.mockReturnValue('[ ] Delete this');
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('d')
        )[1];
        
        keyHandler();
        
        expect(todoList.getTasks()).toHaveLength(2);
        expect(todoList.getTasks().map(t => t.title)).toEqual(['Keep this', 'Keep this too']);
      });
    });

    describe('Edge Cases', () => {
      test('should handle deletion with no tasks', () => {
        mockList.selected = 0;
        mockList.getItem.mockReturnValue(null);
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('d')
        )[1];
        
        expect(() => keyHandler()).not.toThrow();
      });

      test('should handle deletion with invalid selection', () => {
        todoList.addTask('Test task');
        mockList.selected = 999;
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('d')
        )[1];
        
        expect(() => keyHandler()).not.toThrow();
        expect(todoList.getTasks()).toHaveLength(1); // Task should still exist
      });
    });

    describe('Error Handling', () => {
      test('should handle todo list deletion errors', () => {
        todoList.addTask('Test task');
        mockList.selected = 0;
        todoList.deleteTask = jest.fn().mockImplementation(() => {
          throw new Error('Deletion failed');
        });
        
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('d')
        )[1];
        
        expect(() => keyHandler()).toThrow('Failed to delete task');
      });
    });
  });

  describe('Navigation and Filtering', () => {
    // User Story: As a user, I want to see only incomplete tasks so that I can focus on what still needs to be done.
    
    describe('Happy Path', () => {
      test('should filter to show only incomplete tasks', () => {
        const incompleteTask = todoList.addTask('Not done');
        const completeTask = todoList.addTask('Done');
        todoList.completeTask(completeTask.id);
        
        ui.setFilter('incomplete');
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith(['[ ] Not done']);
      });

      test('should filter to show only completed tasks', () => {
        const incompleteTask = todoList.addTask('Not done');
        const completeTask = todoList.addTask('Done');
        todoList.completeTask(completeTask.id);
        
        ui.setFilter('completed');
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith(['[✓] Done']);
      });

      test('should show all tasks when filter is cleared', () => {
        const incompleteTask = todoList.addTask('Not done');
        const completeTask = todoList.addTask('Done');
        todoList.completeTask(completeTask.id);
        
        ui.setFilter('all');
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([
          '[ ] Not done',
          '[✓] Done'
        ]);
      });
    });

    describe('Edge Cases', () => {
      test('should handle filter with no matching tasks', () => {
        todoList.addTask('Incomplete task');
        
        ui.setFilter('completed');
        ui.refreshTaskList();
        
        expect(mockList.setItems).toHaveBeenCalledWith([]);
      });

      test('should handle invalid filter values', () => {
        todoList.addTask('Test task');
        
        expect(() => ui.setFilter('invalid' as any)).toThrow('Invalid filter type');
      });
    });
  });

  describe('Error Display', () => {
    describe('Happy Path', () => {
      test('should display error messages to user', () => {
        ui.showError('Test error message');
        
        expect(mockScreen.render).toHaveBeenCalled();
      });

      test('should clear error messages after timeout', (done) => {
        ui.showError('Test error message');
        
        setTimeout(() => {
          expect(ui.clearError).toHaveBeenCalled();
          done();
        }, 3100); // Slightly longer than error timeout
      });
    });

    describe('Edge Cases', () => {
      test('should handle multiple error messages', () => {
        ui.showError('First error');
        ui.showError('Second error');
        
        expect(mockScreen.render).toHaveBeenCalledTimes(2);
      });

      test('should handle empty error messages', () => {
        expect(() => ui.showError('')).not.toThrow();
      });
    });

    describe('Error Handling', () => {
      test('should handle null error messages', () => {
        expect(() => ui.showError(null as any)).toThrow('Error message cannot be null');
      });

      test('should handle undefined error messages', () => {
        expect(() => ui.showError(undefined as any)).toThrow('Error message cannot be null');
      });
    });
  });

  describe('Cleanup and Shutdown', () => {
    describe('Happy Path', () => {
      test('should destroy screen when application exits', () => {
        const keyHandler = mockScreen.key.mock.calls.find(call => 
          call[0].includes('escape') || call[0].includes('q') || call[0].includes('C-c')
        )[1];
        
        keyHandler();
        
        expect(mockScreen.destroy).toHaveBeenCalled();
      });

      test('should save data before exit', () => {
        todoList.addTask('Test task');
        const saveSpy = jest.spyOn(todoList, 'toJSON');
        
        ui.shutdown();
        
        expect(saveSpy).toHaveBeenCalled();
      });
    });

    describe('Error Handling', () => {
      test('should handle screen destruction errors', () => {
        mockScreen.destroy.mockImplementation(() => {
          throw new Error('Destruction failed');
        });
        
        expect(() => ui.shutdown()).toThrow('Failed to shutdown UI');
      });

      test('should handle save errors during shutdown', () => {
        todoList.toJSON = jest.fn().mockImplementation(() => {
          throw new Error('Save failed');
        });
        
        expect(() => ui.shutdown()).toThrow('Failed to save data during shutdown');
      });
    });
  });
});
