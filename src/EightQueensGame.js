import React, { useState, useEffect } from 'react';

const EightQueensGame = () => {
    const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [message, setMessage] = useState('');
    const [attackingQueens, setAttackingQueens] = useState([]);
    const [queenCount, setQueenCount] = useState(0);

    const handleCellClick = (row, col) => {
        const newBoard = board.map(r => [...r]);
        if (newBoard[row][col] === 1) {
            newBoard[row][col] = 0;
            setQueenCount(prevCount => prevCount - 1);
        } else if (queenCount < 8) {
            newBoard[row][col] = 1;
            setQueenCount(prevCount => prevCount + 1);
        } else {
            setMessage("You can't place more than 8 queens on the board.");
            return;
        }
        setBoard(newBoard);
        setMessage('');
        setAttackingQueens([]);
    };

    const resetGame = () => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(0)));
        setMessage('');
        setAttackingQueens([]);
        setQueenCount(0);
    };

    const checkSolution = () => {
        const queens = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === 1) {
                    queens.push([row, col]);
                }
            }
        }

        const attacking = findAttackingQueens(queens);
        if (attacking.length > 0) {
            setMessage('Invalid solution. Queens are attacking each other.');
            setAttackingQueens(attacking);
            return;
        }

        if (queens.length !== 8) {
            setMessage(`Please place exactly 8 queens on the board. Currently there are ${queens.length} queens.`);
            return;
        }

        setMessage('Congratulations! You\'ve solved the Eight Queens Puzzle!');
        setAttackingQueens([]);
        showConfetti();
    };

    const findAttackingQueens = (queens) => {
        const attacking = [];
        for (let i = 0; i < queens.length; i++) {
            for (let j = i + 1; j < queens.length; j++) {
                const [row1, col1] = queens[i];
                const [row2, col2] = queens[j];
                if (row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
                    attacking.push(queens[i], queens[j]);
                }
            }
        }
        return [...new Set(attacking.map(JSON.stringify))].map(JSON.parse);
    };

    const showConfetti = () => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.top = '0';
        confetti.style.left = '0';
        confetti.style.width = '100%';
        confetti.style.height = '100%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '100';

        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.backgroundColor = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)];
            particle.style.borderRadius = '50%';
            particle.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
            confetti.appendChild(particle);
        }

        document.body.appendChild(confetti);
        setTimeout(() => document.body.removeChild(confetti), 5000);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            position: 'relative'
        }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Eight Queens Puzzle</h1>
            <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                <button
                    onClick={resetGame}
                    style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}
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
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '2px',
                marginBottom: '1rem',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '1 / 1'
            }}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            style={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                                fontWeight: 'bold',
                                backgroundColor: cell === 1
                                    ? (attackingQueens.some(([r, c]) => r === rowIndex && c === colIndex) ? '#ef4444' : '#8b5cf6')
                                    : 'white',
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
                <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.25rem', padding: '1rem', marginBottom: '1rem', maxWidth: '100%', wordBreak: 'break-word' }}>
                    <strong>Game Status:</strong> {message}
                </div>
            )}
            <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: '#4b5563', marginTop: '1rem', textAlign: 'center', maxWidth: '400px' }}>
                Click on a cell to place or remove a queen. Place 8 queens on the board and click "Check Solution" to verify.
            </p>
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