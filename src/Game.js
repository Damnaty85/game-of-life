import React from 'react';
import './Game.scss';
import Cell from "./Cell";

const CELL_SIZE = 10;

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.board = this.makeEmptyBoard();
    }

    state = {
        cells: [],
        interval: 50,
        rows: 50,
        cols: 50,
        isRunning: false,
    };

    makeEmptyBoard() {
        let board = [];
        for (let y = 0; y < this.state.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.state.cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    };

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    };

    createCells() {
        let cells = [];
        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    };

    handleSelectCell = (evt) => {
        const elemOffset = this.getElementOffset();
        const offsetX = evt.clientX - elemOffset.x;
        const offsetY = evt.clientY - elemOffset.y;

        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.state.cols && y >= 0 && y <= this.state.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({
            cells: this.createCells()
        });
    };

    startEvolution = () => {
        this.setState({
            isRunning: true
        });
        this.calculateIteration();
    };

    stopEvolution = () => {
        this.setState({
            isRunning: false
        });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    };

    findingNeighbors(board, x, y) {
        let neighbors = 0;
        const points = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < points.length; i++) {
            const point = points[i];

            let y1 = (y + point[0] + this.state.rows) % this.state.rows;
            let x1 = (x + point[1] + this.state.cols) % this.state.cols;

            if (x1 >= 0 && x1 < this.state.cols && y1 >= 0 && y1 < this.state.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    };

    calculateIteration() {

        let newBoard = this.makeEmptyBoard();

        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                let neighbors = this.findingNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    newBoard[y][x] = neighbors === 2 || neighbors === 3;
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({
            cells: this.createCells()
        });

        this.timeoutHandler = window.setTimeout(() => {
            this.calculateIteration();
        }, this.state.interval);
    };

    handleClearBoard = () => {
        this.stopEvolution();
        this.board = this.makeEmptyBoard();
        this.setState({
            cells: this.createCells()
        });
    };

    handleRandom = () => {
        this.handleClearBoard();
        setTimeout(() =>{
            for (let y = 0; y < this.state.rows; y++) {
                for (let x = 0; x < this.state.cols; x++) {
                    this.board[y][x] = (Math.random() >= 0.5);
                }
            }

            this.setState({
                cells: this.createCells()
            });
        }, 100)
    };

    render() {
        const { cells, isRunning, rows, cols } = this.state;
        return (
            <div className="universe">
                <h1>Conway's Game of Life</h1>
                <div className="universe__controls">
                    {isRunning ?
                        <button onClick={this.stopEvolution}>Остановить эволюцию</button> :
                        !cells.length ?
                            <button disabled>Запустить эволюцию</button>:
                            <button onClick={this.startEvolution}>Запустить эволюцию</button>

                    }
                    <button onClick={this.handleRandom}>Заполнить мир</button>
                    <button onClick={this.handleClearBoard}>Очистить мир</button>
                    <fieldset>
                        <legend>Кол-во столбцов</legend>
                        <button onClick={() => {this.handleClearBoard();this.setState({cols: cols - CELL_SIZE / 10})}}>-</button>
                        <input value={cols} disabled/>
                        <button onClick={() => {this.handleClearBoard();this.setState({cols: cols + CELL_SIZE / 10})}}>+</button>
                    </fieldset>
                    <fieldset>
                        <legend>Кол-во строк</legend>
                        <button onClick={() => {this.handleClearBoard();this.setState({rows: rows - CELL_SIZE / 10})}}>-</button>
                        <input value={rows} disabled/>
                        <button onClick={() => {this.handleClearBoard();this.setState({rows: rows + CELL_SIZE / 10})}}>+</button>
                    </fieldset>
                </div>
                <div className="universe__board"
                     style={{ width: `${cols * CELL_SIZE}px`, height: `${rows * CELL_SIZE}px`, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                     onClick={this.handleSelectCell}
                     ref={(n) => { this.boardRef = n; }}>

                    {cells.map(cell => (
                        <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>
                    ))}
                </div>
            </div>
        );
    }
}
