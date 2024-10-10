import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EightQueensGame = () => {
  const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const isSafe = (row, col) => {
    // Check horizontal
    for (let i = 0; i < 8; i++) {
      if (board[row][i] === 1) return false;
    }

    // Check vertical
    for (let i = 0; i < 8; i++) {
      if (board[i][col] === 1) return false;
    }

    // Check diagonal (top-left to bottom-right)
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    for (let i = row, j = col; i < 8 && j < 8; i++, j++) {
      if (board[i][j] === 1) return false;
    }

    // Check diagonal (top-right to bottom-left)
    for (let i = row, j = col; i >= 0 && j < 8; i--, j++) {
      if (board[i][j] === 1) return false;
    }
    for (let i = row, j = col; i < 8 && j >= 0; i++, j--) {
      if (board[i][j] === 1) return false;
    }

    return true;
  };

  const handleCellClick = (row, col) => {
    if (gameWon) return;

    if (board[row][col] === 1) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = 0;
      setBoard(newBoard);
      setMessage('Queen removed.');
    } else if (isSafe(row, col)) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = 1;
      setBoard(newBoard);
      setMessage('Queen placed successfully!');

      if (newBoard.flat().filter(cell => cell === 1).length === 8) {
        setMessage('Congratulations! You\'ve solved the Eight Queens Puzzle!');
        setGameWon(true);
      }
    } else {
      setMessage('Invalid move! The queen would be under attack.');
    }
  };

  const resetGame = () => {
    setBoard(Array(8).fill(null).map(() => Array(8).fill(0)));
    setMessage('');
    setGameWon(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Eight Queens Puzzle</h1>
      <div className="mb-4">
        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset Game
        </button>
      </div>
      <div className="grid grid-cols-8 gap-1 mb-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`w-12 h-12 flex items-center justify-center text-2xl font-bold
                ${cell === 1 ? 'bg-purple-500 text-white' : 'bg-white'}
                ${gameWon ? 'cursor-not-allowed' : 'hover:bg-gray-200'}
                border border-gray-300`}
            >
              {cell === 1 ? '♛' : ''}
            </button>
          ))
        )}
      </div>
      {message && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Game Status</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-gray-600 mt-4">
        Click on a cell to place or remove a queen. Try to place 8 queens so that no two queens threaten each other.
      </p>
    </div>
  );
};

export default EightQueensGame;
