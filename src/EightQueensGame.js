import React, { useState, useEffect } from 'react';

const EightQueensGame = () => {
    const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [message, setMessage] = useState('');
    const [queenCount, setQueenCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleCellClick = (row, col) => {
        if (queenCount >= 8 && board[row][col] === 0) return;

        const newBoard = board.map(r => [...r]);
        if (newBoard[row][col] === 1) {
            newBoard[row][col] = 0;
            setQueenCount(queenCount - 1);
        } else {
            newBoard[row][col] = 1;
            setQueenCount(queenCount + 1);
        }
        setBoard(newBoard);
        setMessage('');
    };

    const resetGame = () => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(0)));
        setMessage('');
        setQueenCount(0);
        setShowConfetti(false);
    };

    const checkSolution = () => {
        if (queenCount !== 8) {
            setMessage('Please place exactly 8 queens on the board.');
            return;
        }

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === 1) {
                    if (!isSafe(row, col)) {
                        setMessage('Invalid solution. Queens are attacking each other.');
                        return;
                    }
                }
            }
        }

        setMessage('Congratulations! You\'ve solved the Eight Queens Puzzle!');
        setShowConfetti(true);
    };

    const isSafe = (row, col) => {
        // Check horizontal
        for (let i = 0; i < 8; i++) {
            if (i !== col && board[row][i] === 1) return false;
        }

        // Check vertical
        for (let i = 0; i < 8; i++) {
            if (i !== row && board[i][col] === 1) return false;
        }

        // Check diagonals
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i !== row || j !== col) && board[i][j] === 1) {
                    if (Math.abs(i - row) === Math.abs(j - col)) return false;
                }
            }
        }

        return true;
    };

    // Simple confetti effect
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', backgroundColor: '#f3f4f6', position: 'relative' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Eight Queens Puzzle</h1>
            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={resetGame}
                    style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', marginRight: '0.5rem' }}
                >
                    Reset Game
                </button>
                <button
                    onClick={checkSolution}
                    style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                >
                    Check Solution
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
                                cursor: 'pointer',
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
                Click on a cell to place or remove a queen. Place 8 queens on the board and click "Check Solution" to verify.
            </p>
            {showConfetti && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 100,
                }}>
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: '10px',
                                height: '10px',
                                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
                                borderRadius: '50%',
                                animation: `fall ${Math.random() * 3 + 2}s linear`,
                            }}
                        />
                    ))}
                </div>
            )}
            <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default EightQueensGame;