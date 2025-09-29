# Minimal Terminal Todo Manager

A simple terminal-based todo manager built with TypeScript and the blessed library. This application follows the MVC architecture and provides a user-friendly interface for managing todo items.

## Features

- Create, read, update, and delete (CRUD) todo items
- Persistent storage of todos in a JSON file
- Terminal UI with keyboard navigation
- Lightweight and fast startup

## Project Structure

```
todo-manager/
├── src/
│   ├── model/          # Data and storage management
│   ├── view/           # UI components
│   ├── controller/     # Input handling and business logic
│   ├── app.ts          # Application entry point
│   └── index.ts        # Main application runner
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
└── README.md           # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd todo-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up TypeScript environment:
   ```
   npm run build
   ```

## Usage

To start the application, run:
```
npm start
```

## Development

To run the application in development mode with live reloading, use:
```
npm run dev
```

## Testing

Each component of the application can be tested individually. Ensure that all tests pass before committing changes.

## Contribution

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.