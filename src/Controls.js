import React from 'react';

function Controls(props) {
    const {isRunning, stop, cells, start, random, clear, cols, rows, setCols, setRows, cellSize} = props.options;

    function minusCols() {
        clear();
        setCols(
            cols - cellSize / 10
        )
    }

    function minusRows() {
        clear();
        setRows(
            rows - cellSize / 10
        )
    }

    function plusCols() {
        clear();
        setCols(
            cols + cellSize / 10
        )
    }

    function plusRows() {
        clear();
        setRows(
            rows + cellSize / 10
        )
    }

    return(
        <div className="universe__controls">
            {isRunning ?
                <button onClick={stop}>Остановить эволюцию</button> :
                !cells.length ?
                    <button disabled>Запустить эволюцию</button>:
                    <button onClick={start}>Запустить эволюцию</button>

            }
            <button onClick={random}>Заполнить мир</button>
            <button onClick={clear}>Очистить мир</button>
            <fieldset>
                <legend>Кол-во столбцов</legend>
                <button onClick={minusCols}>-</button>
                <input value={cols} disabled/>
                <button onClick={plusCols}>+</button>
            </fieldset>
            <fieldset>
                <legend>Кол-во строк</legend>
                <button onClick={minusRows}>-</button>
                <input value={rows} disabled/>
                <button onClick={plusRows}>+</button>
            </fieldset>
        </div>
    )
}

export default Controls;
