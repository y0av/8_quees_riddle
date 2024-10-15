import React, { useState, useEffect, useCallback, useMemo } from 'react';

const Confetti = React.memo(() => {
    const confettiElements = useMemo(() => {
        const elements = [];
        const colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', '#E0BBE4']; // Pastel colors

        for (let i = 0; i < 100; i++) {
            const style = {
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                animation: `fall ${Math.random() * 3 + 2}s linear infinite`
            };
            elements.push(<div key={i} style={style} />);
        }
        return elements;
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000,
        }}>
            {confettiElements}
        </div>
    );
});

const EightQueensGame = () => {
    const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [message, setMessage] = useState('');
    const [attackingQueens, setAttackingQueens] = useState([]);
    const [queenCount, setQueenCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [animatingCells, setAnimatingCells] = useState([]);

    const handleCellClick = useCallback((row, col) => {
        setBoard(prevBoard => {
            const newBoard = prevBoard.map(r => [...r]);
            if (newBoard[row][col] === 1) {
                newBoard[row][col] = 0;
                setQueenCount(prevCount => prevCount - 1);
                setAnimatingCells(prev => [...prev, { row, col, type: 'remove' }]);
            } else {
                const currentQueenCount = newBoard.flat().filter(cell => cell === 1).length;
                if (currentQueenCount < 8) {
                    newBoard[row][col] = 1;
                    setQueenCount(prevCount => prevCount + 1);
                    setAnimatingCells(prev => [...prev, { row, col, type: 'add' }]);
                } else {
                    setMessage("You can't place more than 8 queens on the board.");
                    return prevBoard;
                }
            }
            setMessage('');
            setAttackingQueens([]);
            return newBoard;
        });
    }, []);

    useEffect(() => {
        if (animatingCells.length > 0) {
            const timer = setTimeout(() => {
                setAnimatingCells([]);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [animatingCells]);

    const resetGame = useCallback(() => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(0)));
        setMessage('');
        setAttackingQueens([]);
        setQueenCount(0);
        setShowConfetti(false);
        setAnimatingCells([]);
    }, []);

    const findAttackingQueens = useCallback((queens) => {
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
    }, []);

    const checkSolution = useCallback(() => {
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
        setShowConfetti(true);
    }, [board, findAttackingQueens]);

    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 15000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

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
            {showConfetti && <Confetti />}
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Eight Queens Puzzle</h1>
            <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: '#4b5563', marginBottom: '1rem', textAlign: 'center', maxWidth: '600px' }}>
                Place 8 queens on the chessboard so that no two queens threaten each other.
                A queen can attack any piece in the same row, column, or diagonal.
            </p>
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
                                backgroundColor: ((rowIndex + colIndex) % 2 === 0 ? '#f3f4f6' : '#d1d5db'),
                                border: '1px solid #d1d5db',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {cell === 1 && (
                                <div style={{
                                    width: '80%',
                                    height: '80%',
                                    backgroundColor: attackingQueens.some(([r, c]) => r === rowIndex && c === colIndex) ? '#ef4444' : '#8b5cf6',
                                    WebkitMask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 45 45'%3E%3Cg fill='%23000' fill-rule='evenodd' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z'/%3E%3Cpath d='M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z' stroke-linecap='butt'/%3E%3Cpath d='M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0' fill='none'/%3E%3C/g%3E%3C/svg%3E\")",
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    mask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 45 45'%3E%3Cg fill='%23000' fill-rule='evenodd' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z'/%3E%3Cpath d='M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z' stroke-linecap='butt'/%3E%3Cpath d='M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0' fill='none'/%3E%3C/g%3E%3C/svg%3E\")",
                                    maskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    animation: animatingCells.some(ac => ac.row === rowIndex && ac.col === colIndex && ac.type === 'add')
                                        ? 'queenAppear 0.3s ease-out'
                                        : animatingCells.some(ac => ac.row === rowIndex && ac.col === colIndex && ac.type === 'remove')
                                            ? 'queenDisappear 0.3s ease-out'
                                            : 'none',
                                }}
                                />
                            )}
                        </button>
                    ))
                )}
            </div>
            <div style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {message && (
                    <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.25rem', padding: '1rem', maxWidth: '100%', wordBreak: 'break-word' }}>
                        <strong>Game Status:</strong> {message}
                    </div>
                )}
            </div>
            <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: '#4b5563', marginTop: '1rem', textAlign: 'center', maxWidth: '400px' }}>
                Click on a cell to place or remove a queen. Place 8 queens on the board and click "Check Solution" to verify.
            </p>
            <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes queenAppear {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes queenDisappear {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default EightQueensGame;