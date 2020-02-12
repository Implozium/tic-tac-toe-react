import React, { Component, useState, useCallback } from "react";
import GridItem from './GridItem';

export default function GridU(props) {
    const [items, setItems] = useState(Array.from({ length: props.size * props.size }).fill(''));
    const [stepHistory, setStepHistory] = useState([]);
    const [end, setEnd] = useState(false);
    const [winner, setWinner] = useState('');
    const [step, setStep] = useState(0);

    const getXYFromIndex = (index) => {
        return {
            x: index % props.size,
            y: Math.floor(index / props.size),
        };
    };
    
    const isWinner = (items, sign, index) => {
        const { x, y } = getXYFromIndex(index);
        const directions = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
        ];
        const getValByXY = (x, y) => {
            if (x < 0 || x >= props.size || y < 0 || y >= props.size) {
                return '';
            }
            return items[y * props.size + x];
        };
    
        return directions.some((direction) => {
            let count = 1;
            let xTo = x;
            let yTo = y;
            while (getValByXY(xTo + direction[0], yTo + direction[1]) === sign) {
                count++;
                xTo += direction[0];
                yTo += direction[1];
            }
            xTo = x;
            yTo = y;
            while (getValByXY(xTo - direction[0], yTo - direction[1]) === sign) {
                count++;
                xTo -= direction[0];
                yTo -= direction[1];
            }
            return count >= props.length;
        });
    };

    const onClickItem = useCallback((index, value) => {
        if (value || end) {
            return;
        }
        setStepHistory(stepHistory.concat({
            items: items,
            sign: step % 2 === 0 ? 'X' : 'O',
            ...getXYFromIndex(index),
        }));
        setStep(step + 1);
        const newItems = items.map((item, i) => i === index ? step % 2 === 0 ? 'X' : 'O' : item);
        setItems(newItems);
        if (isWinner(newItems, step % 2 === 0 ? 'X' : 'O', index)) {
            setWinner(step % 2 === 0 ? 'X' : 'O');
            setEnd(true);
        }
    }, [stepHistory, items, step, winner, end]);

    const onClickReset = useCallback(() => {
        setStepHistory([]);
        setStep(0);
        setItems(Array.from({ length: props.size * props.size }).fill(''));
        setEnd(false);
        setWinner('');
    }, [stepHistory, items, step, winner, end]);

    function toStep(index) {
        setStepHistory(stepHistory.filter((item, i) => i < index));
        setStep(index);
        setItems(stepHistory[index].items);
        setEnd(false);
        setWinner('');
    }

    const rItems = items
        .reduce((arr, item, i) => {
            if (arr.length === 0 || arr[arr.length - 1].length === props.size) {
                arr.push([]);
            }
            arr[arr.length - 1].push({ item, index: i });
            return arr;
        }, [])
        .map((chunk, i) => {
            return <div className="grid__row" key={ i }>
                { chunk.map(({ item, index }) => <GridItem key={ index } value={ item } index={ index } onClick={ onClickItem }></GridItem>) }
            </div>;
        });

    const message = winner
        ? `Победитель ${winner}`
        : step === items.length
            ? 'Ничья'
            : step % 2 === 0
                ? 'Ходит крестик: X'
                : 'Ходит нолик: O';

    const history = stepHistory.map((aStepHistory, i) => {
        return <li key={ i }>
            { aStepHistory.sign } на ({ aStepHistory.x + 1 }, { aStepHistory.y + 1 })
            <button onClick={ () => toStep(i) }>до этого шага</button>
        </li>;
    });

    return <div className="grid">
        <div className="grid__body">
            <div className="grid__title">Игра { props.size } x { props.size } ({ props.length } в ряд)</div>
            <div className="grid__items">{ rItems }</div>
            <div className="grid__footer">
                <div className="grid__info">{ message }</div>
                <button className="grid__button" onClick={ onClickReset }>{ 'Сбросить' }</button>
            </div>
        </div>
        <div className="grid__history">
            { !!history.length && 'История:' }
            <ol>{ history }</ol>
        </div>
    </div>;
}

GridU.defaultProps = {
    size: 3,
    length: 3,
};