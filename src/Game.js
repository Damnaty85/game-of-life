import React, { useState } from 'react';
import './Game.scss';
import Cell from "./Cell";
import Controls from "./Controls";

const CELL_SIZE = 5;
const ROWS_COUNT = 120;
const COlS_COUNT = 170;
const INTERVAL = 30;

function Game() {

    const [rows, setRows] = useState(ROWS_COUNT);
    const [cols, setCols] = useState(COlS_COUNT);
    let [board, setBoard] = useState(makeEmptyBoard);
    let [cells, setCells] = useState([]);
    let [isRunning, setIsRunning] = useState(false);
    let [timeOut, setTimeOut] = useState('');
    let interval = INTERVAL;
    let boardRef;

    function makeEmptyBoard() {
        const board = [];
        for (let y = 0; y < rows; y++) {
            board[y] = [];
            for (let x = 0; x < cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }

    const handleClearBoard = () => {
        stopEvolution();
        setBoard(
            board = makeEmptyBoard()
        );
        setCells(
            cells = createCells()
        );
    };

    function createCells() {
        let cells = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    function calculateIteration() {

        let newBoard = makeEmptyBoard();

        function findingNeighbors(board, x, y) {
            let neighbors = 0;
            const points = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
            for (let i = 0; i < points.length; i++) {
                const point = points[i];

                let y1 = (y + point[0] + rows) % rows;
                let x1 = (x + point[1] + cols) % cols;

                if (x1 >= 0 && x1 < cols && y1 >= 0 && y1 < rows && board[y1][x1]) {
                    neighbors++;
                }
            }

            return neighbors;
        }

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let neighbors = findingNeighbors(board, x, y);
                if (board[y][x]) {
                    newBoard[y][x] = neighbors === 2 || neighbors === 3;
                } else {
                    if (!board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        setBoard(
            board = newBoard
        );

        setCells(
            cells = createCells()
        );

        setTimeOut(
            timeOut = window.setTimeout(() => {
                calculateIteration();
            }, interval)
        )
    }

     const startEvolution = () => {
        setIsRunning(
            isRunning = true
        );
        calculateIteration();
    };

    const stopEvolution = () => {
        setIsRunning(
            isRunning = false
        );
        if (timeOut) {
            window.clearTimeout(timeOut);
            setTimeOut(
                timeOut = null
            );
        }
    };

     const handleRandom = () => {
        handleClearBoard();
        setTimeout(() =>{
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    board[y][x] = (Math.random() >= 0.5);
                }
            }

            setCells(
                cells = createCells()
            );
        }, 100)
    };

     function getElementOffset() {
        const rect = boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

     const handleSelectCell = (evt) => {
        const elemOffset = getElementOffset();
        const offsetX = evt.clientX - elemOffset.x;
        const offsetY = evt.clientY - elemOffset.y;

        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
            board[y][x] = !board[y][x];
        }

        setCells(
            cells = createCells()
        );
     };

     const options = {
         cellSize: CELL_SIZE,
         cols: cols,
         rows: rows,
         cells: cells,
         isRunning: isRunning,
         start: startEvolution,
         stop: stopEvolution,
         random: handleRandom,
         clear: handleClearBoard,
         setCols: setCols,
         setRows: setRows,
     };

     return(
         <div className="universe">
             <h1>Conway's Game of Life</h1>
             <Controls options={options}/>
             <div className="universe__board"
                  style={{ width: `${cols * CELL_SIZE}px`, height: `${rows * CELL_SIZE}px`, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                  onClick={handleSelectCell}
                  ref={(n) => { boardRef = n; }}
             >
                 {cells.map(cell => (
                     <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} cellSize={CELL_SIZE}/>
                     ))
                 }
             </div>
         </div>
     )
}


export default Game;
