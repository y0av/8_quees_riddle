import React, { useState } from 'react';

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', backgroundColor: '#f3f4f6' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Eight Queens Puzzle</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={resetGame}
          style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}
        >
          Reset Game
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px', marginBottom: '1rem' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                backgroundColor: cell === 1 ? '#8b5cf6' : 'white',
                color: cell === 1 ? 'white' : 'black',
                border: '1px solid #d1d5db',
                cursor: gameWon ? 'not-allowed' : 'pointer',
              }}
            >
              {cell === 1 ? '♛' : ''}
            </button>
          ))
        )}
      </div>
      {message && (
        <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.25rem', padding: '1rem', marginBottom: '1rem' }}>
          <strong>Game Status:</strong> {message}
        </div>
      )}
      <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '1rem' }}>
        Click on a cell to place or remove a queen. Try to place 8 queens so that no two queens threaten each other.
      </p>
    </div>
  );
};

export default EightQueensGame;