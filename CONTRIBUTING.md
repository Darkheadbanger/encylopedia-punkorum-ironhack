# Contributing to Encyclopedia Punkorum

Thank you for considering contributing to Encyclopedia Punkorum! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with the following information:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node.js version, browser, etc.)

### Suggesting Enhancements

We welcome suggestions for new features! Please open an issue with:
- A clear and descriptive title
- Detailed description of the proposed feature
- Why this feature would be useful
- Any examples or mockups (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** for both frontend and backend
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear, concise commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Keep pull requests focused on a single issue or feature

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Darkheadbanger/encylopedia-punkorum-ironhack.git
cd encylopedia-punkorum-ironhack
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables (see `.env.example` files)

4. Run the development servers:
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## Coding Standards

### JavaScript/React
- Use ES6+ syntax
- Follow the Airbnb JavaScript Style Guide
- Use functional components and hooks in React
- Write meaningful variable and function names
- Add comments for complex logic

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep first line under 50 characters
- Reference issues and pull requests when applicable

Examples:
```
Add band search functionality
Fix album display on mobile devices
Update README with API documentation
```

## Code Review Process

All pull requests will be reviewed by maintainers. We may suggest changes, improvements, or alternatives. Please be patient and responsive to feedback.

## Community

- Be respectful and inclusive
- Follow the code of conduct
- Help others when you can
- Share knowledge and learn together

## Questions?

If you have any questions about contributing, feel free to open an issue or reach out to the maintainers.

Thank you for contributing to Encyclopedia Punkorum! 🎸🤘
