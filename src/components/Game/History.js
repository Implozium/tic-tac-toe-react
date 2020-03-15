import React, { useCallback } from "react";

export function HistoryItem({ item, index, onClick = () => {} }) {
    const memoOnClick = useCallback(() => onClick(index), [index]);
    const items = item.items.concat();
    items[item.index] = item.sign;

    const rItems = items
        .reduce((arr, elem, i) => {
            if (arr.length === 0 || arr[arr.length - 1].length === item.size) {
                arr.push([]);
            }
            arr[arr.length - 1].push({ item: elem, index: i });
            return arr;
        }, [])
        .map((chunk, i) => {
            return <div className="game__row" key={ i }>
                { chunk.map(({ item: elem, index }) => (
                    <div
                        key={ index }
                        className={ 'game__cell' + (index === item.index ? ' game__cell_active' : '') + (elem === 'X' ? ' game__cell_x' : elem === 'O' ? ' game__cell_o' : '')}
                    >
                        { elem }
                    </div>)
                ) }
            </div>;
        });

    return (
        <li className='game__history-item'>
            <div>{ rItems }</div>
            <div>{ item.sign } на ({ item.x + 1 }, { item.y + 1 })</div>
            <button onClick={ memoOnClick }>до этого шага</button>
        </li>
    );
}

export default function History({ items = [], onClick = () => {} }) {
    const history = items.map((item, i) => {
        return <HistoryItem key={ i } index={ i } item={ item } onClick={ onClick }/>;
    });

    return (
        <div className="game__history">
            { !!history.length && 'История:' }
            <ol className="game__history-body">{ history }</ol>
        </div>
    );
}