import * as fs from 'fs';
import * as path from 'path';
import { TodoApp } from '../todo_main';
import { TodoList, Priority } from '../src/todo';
import { BlessedTodoUI } from '../src/blessed_todo';

// Mock file system operations
jest.mock('fs');
jest.mock('../src/blessed_todo');

describe('TodoApp Integration Tests', () => {
  let app: TodoApp;
  let mockUI: jest.Mocked<BlessedTodoUI>;
  let mockFs: jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFs = fs as jest.Mocked<typeof fs>;
    mockUI = {
      start: jest.fn(),
      shutdown: jest.fn(),
      refreshTaskList: jest.fn(),
      showError: jest.fn(),
      setFilter: jest.fn(),
      handleAddTask: jest.fn(),
      showAddTaskForm: jest.fn(),
      clearError: jest.fn()
    } as any;

    (BlessedTodoUI as jest.Mock).mockImplementation(() => mockUI);
    
    app = new TodoApp();
  });

  describe('Application Initialization', () => {
    // Integration of all user stories: Application startup and data loading
    
    describe('Happy Path', () => {
      test('should initialize with empty todo list when no save file exists', () => {
        mockFs.existsSync.mockReturnValue(false);
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(0);
        expect(BlessedTodoUI).toHaveBeenCalledWith(expect.any(TodoList));
      });

      test('should load existing todo list from save file', () => {
        const savedData = {
          tasks: [
            {
              id: 'task1',
              title: 'Existing task',
              completed: false,
              priority: Priority.MEDIUM,
              category: null,
              dueDate: null,
              createdAt: new Date().toISOString(),
              completedAt: null
            }
          ]
        };
        
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue(JSON.stringify(savedData));
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(1);
        expect(app.getTodoList().getTasks()[0].title).toBe('Existing task');
      });

      test('should create UI with loaded todo list', () => {
        mockFs.existsSync.mockReturnValue(false);
        
        app.initialize();
        
        expect(BlessedTodoUI).toHaveBeenCalledWith(expect.any(TodoList));
      });

      test('should start UI after initialization', () => {
        mockFs.existsSync.mockReturnValue(false);
        
        app.start();
        
        expect(mockUI.start).toHaveBeenCalled();
      });
    });

    describe('Edge Cases', () => {
      test('should handle corrupted save file gracefully', () => {
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue('invalid json');
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(0);
        expect(mockUI.showError).toHaveBeenCalledWith('Failed to load saved data, starting fresh');
      });

      test('should handle empty save file', () => {
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue('');
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(0);
      });

      test('should handle save file with no tasks', () => {
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue('{"tasks": []}');
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(0);
      });

      test('should handle large save files', () => {
        const largeTasks = Array.from({ length: 1000 }, (_, i) => ({
          id: `task${i}`,
          title: `Task ${i}`,
          completed: false,
          priority: Priority.MEDIUM,
          category: null,
          dueDate: null,
          createdAt: new Date().toISOString(),
          completedAt: null
        }));
        
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue(JSON.stringify({ tasks: largeTasks }));
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(1000);
      });
    });

    describe('Error Handling', () => {
      test('should handle file system read errors', () => {
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockImplementation(() => {
          throw new Error('File read error');
        });
        
        app.initialize();
        
        expect(app.getTodoList().getTasks()).toHaveLength(0);
        expect(mockUI.showError).toHaveBeenCalledWith('Failed to load saved data, starting fresh');
      });

      test('should handle UI creation errors', () => {
        (BlessedTodoUI as jest.Mock).mockImplementation(() => {
          throw new Error('UI creation failed');
        });
        
        expect(() => app.initialize()).toThrow('Failed to initialize application');
      });

      test('should handle missing save directory', () => {
        mockFs.existsSync.mockReturnValue(false);
        mockFs.mkdirSync = jest.fn();
        
        app.initialize();
        
        expect(mockFs.mkdirSync).toHaveBeenCalledWith(
          expect.stringContaining('.todo'),
          { recursive: true }
        );
      });
    });
  });

  describe('Data Persistence', () => {
    // User Stories: Auto-save and data availability on restart
    
    describe('Happy Path', () => {
      test('should auto-save when tasks are added', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        app.getTodoList().addTask('New task');
        app.save();
        
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(
          expect.stringContaining('todos.json'),
          expect.stringContaining('New task')
        );
      });

      test('should auto-save when tasks are completed', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        const task = app.getTodoList().addTask('Task to complete');
        app.getTodoList().completeTask(task.id);
        app.save();
        
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(
          expect.stringContaining('todos.json'),
          expect.stringMatching(/"completed":true/)
        );
      });

      test('should auto-save when tasks are deleted', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        const task = app.getTodoList().addTask('Task to delete');
        app.getTodoList().deleteTask(task.id);
        app.save();
        
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(
          expect.stringContaining('todos.json'),
          expect.not.stringContaining('Task to delete')
        );
      });

      test('should save on application shutdown', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        app.getTodoList().addTask('Task to save');
        
        app.shutdown();
        
        expect(mockFs.writeFileSync).toHaveBeenCalled();
        expect(mockUI.shutdown).toHaveBeenCalled();
      });

      test('should preserve task metadata during save/load cycle', () => {
        // Initial save
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        const task = app.getTodoList().addTask('Complex task', {
          priority: Priority.HIGH,
          category: 'Work',
          dueDate: new Date('2024-12-31')
        });
        app.getTodoList().completeTask(task.id);
        
        const savedData = app.getTodoList().toJSON();
        mockFs.writeFileSync.mockImplementation((path, data) => {
          // Simulate the save
        });
        
        app.save();
        
        // Simulate restart and load
        mockFs.readFileSync.mockReturnValue(savedData);
        const newApp = new TodoApp();
        newApp.initialize();
        
        const loadedTasks = newApp.getTodoList().getTasks();
        expect(loadedTasks).toHaveLength(1);
        expect(loadedTasks[0].title).toBe('Complex task');
        expect(loadedTasks[0].priority).toBe(Priority.HIGH);
        expect(loadedTasks[0].category).toBe('Work');
        expect(loadedTasks[0].completed).toBe(true);
        expect(loadedTasks[0].dueDate).toEqual(new Date('2024-12-31'));
      });
    });

    describe('Edge Cases', () => {
      test('should handle save directory creation', () => {
        mockFs.existsSync.mockReturnValue(false);
        mockFs.mkdirSync = jest.fn();
        
        app.initialize();
        app.save();
        
        expect(mockFs.mkdirSync).toHaveBeenCalledWith(
          expect.stringContaining('.todo'),
          { recursive: true }
        );
      });

      test('should handle concurrent save operations', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        app.getTodoList().addTask('Task 1');
        app.getTodoList().addTask('Task 2');
        
        // Simulate concurrent saves
        app.save();
        app.save();
        
        expect(mockFs.writeFileSync).toHaveBeenCalledTimes(2);
      });

      test('should handle save with empty todo list', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        app.save();
        
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(
          expect.stringContaining('todos.json'),
          '{"tasks":[]}'
        );
      });
    });

    describe('Error Handling', () => {
      test('should handle save file write errors', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        mockFs.writeFileSync.mockImplementation(() => {
          throw new Error('Write failed');
        });
        
        expect(() => app.save()).toThrow('Failed to save todo data');
      });

      test('should handle save directory creation errors', () => {
        mockFs.existsSync.mockReturnValue(false);
        mockFs.mkdirSync = jest.fn().mockImplementation(() => {
          throw new Error('Directory creation failed');
        });
        
        expect(() => app.save()).toThrow('Failed to create save directory');
      });

      test('should handle disk full errors during save', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        mockFs.writeFileSync.mockImplementation(() => {
          const error = new Error('ENOSPC: no space left on device');
          (error as any).code = 'ENOSPC';
          throw error;
        });
        
        expect(() => app.save()).toThrow('Insufficient disk space to save todo data');
      });
    });
  });

  describe('Task Management Integration', () => {
    // Integration of core task management user stories
    
    describe('Happy Path', () => {
      test('should handle complete task workflow', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Add task
        const task = app.getTodoList().addTask('Complete workflow test', {
          priority: Priority.HIGH,
          category: 'Testing'
        });
        
        expect(app.getTodoList().getTasks()).toHaveLength(1);
        
        // Complete task
        app.getTodoList().completeTask(task.id);
        expect(task.completed).toBe(true);
        
        // Verify task is in completed list
        const completedTasks = app.getTodoList().getCompletedTasks();
        expect(completedTasks).toHaveLength(1);
        expect(completedTasks[0]).toBe(task);
        
        // Delete task
        app.getTodoList().deleteTask(task.id);
        expect(app.getTodoList().getTasks()).toHaveLength(0);
      });

      test('should handle multiple task operations', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Add multiple tasks
        const task1 = app.getTodoList().addTask('Task 1', { priority: Priority.HIGH });
        const task2 = app.getTodoList().addTask('Task 2', { priority: Priority.LOW });
        const task3 = app.getTodoList().addTask('Task 3', { category: 'Work' });
        
        expect(app.getTodoList().getTasks()).toHaveLength(3);
        
        // Complete some tasks
        app.getTodoList().completeTask(task1.id);
        app.getTodoList().completeTask(task3.id);
        
        // Verify filtering works
        expect(app.getTodoList().getIncompleteTasks()).toHaveLength(1);
        expect(app.getTodoList().getCompletedTasks()).toHaveLength(2);
        
        // Verify priority sorting
        const tasksByPriority = app.getTodoList().getTasksByPriority();
        expect(tasksByPriority[0]).toBe(task1); // High priority first
        expect(tasksByPriority[2]).toBe(task2); // Low priority last
      });

      test('should handle task search and categorization', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        app.getTodoList().addTask('Buy groceries', { category: 'Shopping' });
        app.getTodoList().addTask('Buy books', { category: 'Shopping' });
        app.getTodoList().addTask('Read books', { category: 'Learning' });
        app.getTodoList().addTask('Grocery shopping', { category: 'Shopping' });
        
        // Test search functionality
        const buyTasks = app.getTodoList().searchTasks('buy');
        expect(buyTasks).toHaveLength(2);
        
        // Test category filtering
        const shoppingTasks = app.getTodoList().getTasksByCategory('Shopping');
        expect(shoppingTasks).toHaveLength(3);
        
        // Test category listing
        const categories = app.getTodoList().getCategories();
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Learning');
      });
    });

    describe('Edge Cases', () => {
      test('should handle rapid task operations', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Rapidly add and remove tasks
        for (let i = 0; i < 100; i++) {
          const task = app.getTodoList().addTask(`Task ${i}`);
          if (i % 2 === 0) {
            app.getTodoList().completeTask(task.id);
          }
          if (i % 3 === 0) {
            app.getTodoList().deleteTask(task.id);
          }
        }
        
        // Verify final state is consistent
        const remainingTasks = app.getTodoList().getTasks();
        expect(remainingTasks.length).toBeGreaterThan(0);
        expect(remainingTasks.length).toBeLessThan(100);
      });

      test('should handle task operations with special characters', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        const specialTask = app.getTodoList().addTask('Task with émojis 🎉 and spëcial chars', {
          category: 'Tësting & Spëcial'
        });
        
        // Verify search works with special characters
        const results = app.getTodoList().searchTasks('émojis');
        expect(results).toHaveLength(1);
        
        // Verify category works with special characters
        const categoryTasks = app.getTodoList().getTasksByCategory('Tësting & Spëcial');
        expect(categoryTasks).toHaveLength(1);
      });
    });

    describe('Error Handling', () => {
      test('should handle invalid task operations gracefully', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Try to complete non-existent task
        expect(() => app.getTodoList().completeTask('invalid-id')).toThrow('Task not found');
        
        // Try to delete non-existent task
        expect(() => app.getTodoList().deleteTask('invalid-id')).toThrow('Task not found');
        
        // Try to update non-existent task
        expect(() => app.getTodoList().updateTaskPriority('invalid-id', Priority.HIGH))
          .toThrow('Task not found');
      });

      test('should handle memory constraints with large task lists', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Add a large number of tasks
        for (let i = 0; i < 10000; i++) {
          app.getTodoList().addTask(`Task ${i}`, {
            priority: i % 3 === 0 ? Priority.HIGH : Priority.MEDIUM,
            category: `Category ${i % 10}`,
            dueDate: new Date(Date.now() + i * 86400000) // Different due dates
          });
        }
        
        // Verify operations still work
        expect(app.getTodoList().getTasks()).toHaveLength(10000);
        expect(app.getTodoList().getCategories()).toHaveLength(10);
        
        // Verify search still works
        const searchResults = app.getTodoList().searchTasks('Task 1');
        expect(searchResults.length).toBeGreaterThan(1000); // Should find Task 1, Task 10, Task 100, etc.
      });
    });
  });

  describe('Application Lifecycle', () => {
    describe('Happy Path', () => {
      test('should handle complete application lifecycle', () => {
        // Initialize
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Add some data
        app.getTodoList().addTask('Lifecycle test task');
        
        // Start UI
        app.start();
        expect(mockUI.start).toHaveBeenCalled();
        
        // Save data
        app.save();
        expect(mockFs.writeFileSync).toHaveBeenCalled();
        
        // Shutdown
        app.shutdown();
        expect(mockUI.shutdown).toHaveBeenCalled();
      });

      test('should handle restart with existing data', () => {
        // First run
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        app.getTodoList().addTask('Persistent task');
        const savedData = app.getTodoList().toJSON();
        app.shutdown();
        
        // Second run - simulate restart
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue(savedData);
        
        const newApp = new TodoApp();
        newApp.initialize();
        
        expect(newApp.getTodoList().getTasks()).toHaveLength(1);
        expect(newApp.getTodoList().getTasks()[0].title).toBe('Persistent task');
      });
    });

    describe('Error Handling', () => {
      test('should handle graceful shutdown on errors', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        
        // Simulate error during operation
        mockUI.start.mockImplementation(() => {
          throw new Error('UI error');
        });
        
        expect(() => app.start()).toThrow('UI error');
        
        // Should still be able to shutdown gracefully
        expect(() => app.shutdown()).not.toThrow();
      });

      test('should handle process termination signals', () => {
        mockFs.existsSync.mockReturnValue(false);
        app.initialize();
        app.getTodoList().addTask('Task before termination');
        
        // Simulate process termination
        const saveSpy = jest.spyOn(app, 'save');
        app.handleProcessTermination();
        
        expect(saveSpy).toHaveBeenCalled();
      });
    });
  });
});
