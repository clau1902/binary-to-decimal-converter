# Binary to Decimal Converter

A simple and elegant web application that converts binary numbers to decimal numbers in real-time. Built with Next.js, TypeScript, and styled with Tailwind CSS and shadcn/ui components.

## Description

This app provides a user-friendly interface for converting binary numbers (base 2) to decimal numbers (base 10). Simply enter a binary number consisting of 0s and 1s, and the decimal equivalent will be displayed instantly. The app includes input validation to ensure only valid binary digits are entered.

### Features

- **Real-time conversion**: See decimal results as you type
- **Input validation**: Only accepts valid binary digits (0s and 1s)
- **Error handling**: Clear error messages for invalid input
- **Modern UI**: Beautiful pastel color palette with shadcn/ui components
- **Responsive design**: Works seamlessly on all screen sizes
- **Dark mode support**: Automatic theme support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd binary-to-number
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## How to Use

1. Enter a binary number (e.g., `1010`) in the input field
2. The decimal result will appear automatically below
3. Invalid characters will show an error message
4. Click the "Clear" button to reset the converter


## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
