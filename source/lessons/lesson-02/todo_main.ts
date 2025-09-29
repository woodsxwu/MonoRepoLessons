#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TodoList } from './src/todo';
import { BlessedTodoUI } from './src/blessed_todo';

export class TodoApp {
  private todoList: TodoList;
  private ui: BlessedTodoUI | null = null;
  private saveFilePath: string;

  constructor() {
    this.todoList = new TodoList();
    this.saveFilePath = this.getSaveFilePath();
    this.setupProcessHandlers();
  }

  private getSaveFilePath(): string {
    const homeDir = os.homedir();
    const todoDir = path.join(homeDir, '.todo');
    return path.join(todoDir, 'todos.json');
  }

  private setupProcessHandlers(): void {
    // Handle graceful shutdown on various signals
    process.on('SIGINT', () => this.handleProcessTermination());
    process.on('SIGTERM', () => this.handleProcessTermination());
    process.on('beforeExit', () => this.handleProcessTermination());
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.handleProcessTermination();
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.handleProcessTermination();
      process.exit(1);
    });
  }

  public initialize(): void {
    try {
      console.log('Initializing Todo List Manager...');
      
      // Load existing data if available
      this.loadData();
      
      // Create UI
      this.ui = new BlessedTodoUI(this.todoList);
      
      // Setup auto-save
      this.setupAutoSave();
      
      console.log('Initialization complete.');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw new Error('Failed to initialize application');
    }
  }

  private loadData(): void {
    try {
      if (fs.existsSync(this.saveFilePath)) {
        console.log(`Loading data from ${this.saveFilePath}...`);
        const data = fs.readFileSync(this.saveFilePath, 'utf8');
        
        if (data.trim()) {
          this.todoList = TodoList.fromJSON(data);
          console.log('Data loaded successfully.');
        } else {
          console.log('Save file is empty, starting with fresh data.');
        }
      } else {
        console.log('No existing save file found, starting with fresh data.');
        this.ensureSaveDirectory();
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
      console.log('Starting with fresh data.');
      this.todoList = new TodoList();
      
      if (this.ui) {
        this.ui.showError('Failed to load saved data, starting fresh');
      }
    }
  }

  private ensureSaveDirectory(): void {
    try {
      const saveDir = path.dirname(this.saveFilePath);
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
        console.log(`Created save directory: ${saveDir}`);
      }
    } catch (error) {
      console.error('Failed to create save directory:', error);
      throw new Error('Failed to create save directory');
    }
  }

  private setupAutoSave(): void {
    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      try {
        this.save();
      } catch (error) {
        console.error('Auto-save failed:', error);
        if (this.ui) {
          this.ui.showError('Auto-save failed');
        }
      }
    }, 30000);
  }

  public save(): void {
    try {
      this.ensureSaveDirectory();
      
      const data = this.todoList.toJSON();
      fs.writeFileSync(this.saveFilePath, data, 'utf8');
      
      console.log(`Data saved to ${this.saveFilePath}`);
    } catch (error) {
      if ((error as any).code === 'ENOSPC') {
        throw new Error('Insufficient disk space to save todo data');
      }
      console.error('Failed to save data:', error);
      throw new Error('Failed to save todo data');
    }
  }

  public start(): void {
    try {
      if (!this.ui) {
        throw new Error('UI not initialized. Call initialize() first.');
      }

      console.log('Starting Todo List Manager UI...');
      console.log('Press Ctrl+C or \'q\' to quit');
      
      // Start the UI
      this.ui.start();
      
    } catch (error) {
      console.error('Failed to start application:', error);
      throw error;
    }
  }

  public shutdown(): void {
    try {
      console.log('Shutting down Todo List Manager...');
      
      // Stop auto-save
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
      
      // Save final state
      this.save();
      
      // Shutdown UI
      if (this.ui) {
        this.ui.shutdown();
      }
      
      console.log('Shutdown complete.');
    } catch (error) {
      console.error('Error during shutdown:', error);
      if ((error as Error).message.includes('save')) {
        throw new Error('Failed to save data during shutdown');
      }
      throw new Error('Failed to shutdown UI');
    }
  }

  public handleProcessTermination(): void {
    try {
      this.save();
      console.log('Data saved before exit.');
    } catch (error) {
      console.error('Failed to save data before exit:', error);
    }
  }

  public getTodoList(): TodoList {
    return this.todoList;
  }

  // Utility methods for testing and debugging
  public getStats(): { total: number; completed: number; incomplete: number } {
    const allTasks = this.todoList.getTasks();
    const completed = this.todoList.getCompletedTasks();
    const incomplete = this.todoList.getIncompleteTasks();
    
    return {
      total: allTasks.length,
      completed: completed.length,
      incomplete: incomplete.length
    };
  }

  public getCurrentSaveFilePath(): string {
    return this.saveFilePath;
  }

  public setSaveFilePath(filePath: string): void {
    this.saveFilePath = filePath;
  }
}

// Main execution function
function main(): void {
  try {
    const app = new TodoApp();
    
    // Initialize the application
    app.initialize();
    
    // Start the UI
    app.start();
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Export for testing
export { main };

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
