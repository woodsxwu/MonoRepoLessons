import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from '../App';

// Create the same theme used in main.tsx for consistent testing
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6aaa64',
    },
    secondary: {
      main: '#c9b458',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});

// Helper function to render App with theme provider (like in main.tsx)
const renderAppWithTheme = () => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe('Wordle App - Basic Rendering Tests', () => {
  describe('🟢 Beginner Level Tests', () => {
    test('App renders without crashing', () => {
      // This test ensures the app can mount and render without throwing errors
      renderAppWithTheme();
      
      // If we get here without an error, the app rendered successfully!
      // We can add a simple assertion to make sure something is in the document
      expect(document.body).toBeInTheDocument();
    });

    test('Title displays correctly', () => {
      renderAppWithTheme();
      
      // Look for the main title using the test ID
      const titleElement = screen.getByTestId('game-title');
      
      // Check that the title exists and has the correct text
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Wordle Testing Game');
    });

    test('Game board shows 6 rows of empty cells', () => {
      renderAppWithTheme();
      
      // Find the game board
      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toBeInTheDocument();
      
      // Check that we have 6 rows (0-5)
      for (let row = 0; row < 6; row++) {
        // For each row, check that we have the correct number of cells
        // Default word length is 5, so we should have 5 cells per row
        for (let col = 0; col < 5; col++) {
          const cell = screen.getByTestId(`cell-${row}-${col}`);
          expect(cell).toBeInTheDocument();
          
          // Initially, all cells should be empty
          expect(cell).toHaveTextContent('');
        }
      }
    });

    // TODO: Add more tests here!
    // Students can continue with:
    // - Current guess display is present
    // - Virtual keyboard is present  
    // - All control buttons are present
    // - Word length selection tests
    // - Virtual keyboard functionality tests
    // - And much more!

    test('Current guess display is present', () => {
      renderAppWithTheme();
      
      // Check that the current guess label is present
      const currentGuessLabel = screen.getByTestId('current-guess-label');
      expect(currentGuessLabel).toBeInTheDocument();
      expect(currentGuessLabel).toHaveTextContent('Current Guess');
      
      // Check that the current guess display container is present
      const currentGuessDisplay = screen.getByTestId('current-guess-display');
      expect(currentGuessDisplay).toBeInTheDocument();
      
      // Check that guess instructions are present
      const guessInstructions = screen.getByTestId('guess-instructions');
      expect(guessInstructions).toBeInTheDocument();
      
      // Check that individual letter boxes are present (should have 5 letter positions)
      for (let i = 0; i < 5; i++) {
        const letterBox = screen.getByTestId(`current-guess-letter-${i}`);
        expect(letterBox).toBeInTheDocument();
      }
    });

    test('Virtual keyboard is present', () => {
      renderAppWithTheme();
      
      // Check that the virtual keyboard container is present
      const virtualKeyboard = screen.getByTestId('virtual-keyboard');
      expect(virtualKeyboard).toBeInTheDocument();
      
      // Check that all keyboard rows are present
      for (let row = 0; row < 3; row++) {
        const keyboardRow = screen.getByTestId(`keyboard-row-${row}`);
        expect(keyboardRow).toBeInTheDocument();
      }
      
      // Check that all letter keys are present (A-Z)
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (const letter of letters) {
        const letterKey = screen.getByTestId(`keyboard-key-${letter.toLowerCase()}`);
        expect(letterKey).toBeInTheDocument();
        expect(letterKey).toHaveTextContent(letter);
      }
    });

    test('All control buttons are present', () => {
      renderAppWithTheme();
      
      // Check ENTER key
      const enterKey = screen.getByTestId('keyboard-key-enter');
      expect(enterKey).toBeInTheDocument();
      expect(enterKey).toHaveTextContent('ENTER');
      
      // Check BACKSPACE key
      const backspaceKey = screen.getByTestId('keyboard-key-backspace');
      expect(backspaceKey).toBeInTheDocument();
      expect(backspaceKey).toHaveTextContent('⌫');
      
      // Check New Game button
      const newGameButton = screen.getByTestId('new-game-button');
      expect(newGameButton).toBeInTheDocument();
      expect(newGameButton).toHaveTextContent('New Game');
    });

    test('Word length selection tests', () => {
      renderAppWithTheme();
      
      // Check that word length selector is present
      const wordLengthSelector = screen.getByTestId('word-length-selector');
      expect(wordLengthSelector).toBeInTheDocument();
      
      // Check that the select element is present
      const selectElement = screen.getByRole('combobox', { name: /word length/i });
      expect(selectElement).toBeInTheDocument();
      
      // Check that default value is 5
      expect(selectElement).toHaveValue('5');
      
      // Check that all word length options are available (3, 4, 5, 6, 7)
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(5);
      
      const expectedLengths = ['3', '4', '5', '6', '7'];
      expectedLengths.forEach(length => {
        expect(screen.getByRole('option', { name: `${length} letters` })).toBeInTheDocument();
      });
    });

    test('Virtual keyboard functionality tests', () => {
      renderAppWithTheme();
      
      // Check that letter keys are clickable and not disabled initially
      const letterA = screen.getByTestId('keyboard-key-a');
      expect(letterA).toBeInTheDocument();
      expect(letterA).not.toBeDisabled();
      
      // Check that ENTER key is initially disabled (no complete guess)
      const enterKey = screen.getByTestId('keyboard-key-enter');
      expect(enterKey).toBeDisabled();
      
      // Check that BACKSPACE key is not disabled
      const backspaceKey = screen.getByTestId('keyboard-key-backspace');
      expect(backspaceKey).not.toBeDisabled();
      
      // Check that keys have proper styling classes
      expect(letterA).toHaveClass('MuiButton-contained');
      expect(enterKey).toHaveClass('MuiButton-contained');
      expect(backspaceKey).toHaveClass('MuiButton-contained');
    });

  // TODO: Add more test suites here!
  // describe('🟡 Intermediate Level Tests', () => { ... });
  // describe('🔴 Advanced Level Tests', () => { ... });
  // describe('🚀 Expert Level Tests', () => { ... });
});

/*
 * 🎯 STUDENT INSTRUCTIONS:
 * 
 * This file contains starter tests to get you going. Your mission is to:
 * 
 * 1. Run these tests and make sure they pass: `npm test`
 * 2. Add more rendering tests (current guess display, virtual keyboard, etc.)
 * 3. Move on to interaction tests (clicking keys, submitting guesses, etc.)
 * 4. Test edge cases and complex scenarios
 * 
 * Remember:
 * - Use `screen.getByTestId()` to find elements reliably
 * - Use `userEvent` for user interactions (clicking, typing)
 * - Use `waitFor()` for async operations
 * - Check the README.md for comprehensive testing scenarios
 * 
 * Good luck! 🍀
 */
});
