import React, { Component, useState, useCallback, useEffect } from "react";

/**
 * Возвращает координаты (x, y) для одномерного массива с шириной size по индексу index
 * @param {number} index индекс
 * @param {number} size ширина массива
 * @return {{x: number, y: number}}
 */
export function getXYFromIndex(index, size) {
    return {
        x: index % size,
        y: Math.floor(index / size),
    };
};

/**
 * Определяет победил ли знак sign по индексу index на доске items с шириной size и размерностью length
 * @param {string[]} items одномерный массив
 * @param {string} sign знак
 * @param {number} index индекс
 * @param {number} size ширина массива
 * @param {number} length размерностью для игры
 * @return {boolean}
 */
export function isWinner(items, sign, index, size, length) {
    const { x, y } = getXYFromIndex(index, size);
    const directions = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
    ];
    const getValByXY = (x, y) => {
        if (x < 0 || x >= size || y < 0 || y >= size) {
            return '';
        }
        return items[y * size + x];
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
        return count >= length;
    });
};

/**
 * 
 * @param {number} size 
 * @param {number} length 
 * @return {{
        items: string[],
        stepHistory: *[],
        end: boolean,
        winner: string,
        step: number,
        onClickItem: function (number, number): void,
        onClickReset: function (): void,
        toStep: function (number): void
    }}
 */
export default function useGame(size, length) {
    const [items, setItems] = useState([]);
    const [stepHistory, setStepHistory] = useState([]);
    const [end, setEnd] = useState(false);
    const [winner, setWinner] = useState('');
    const [step, setStep] = useState(0);

    useEffect(() => {
        setStepHistory([]);
        setStep(0);
        setItems(Array.from({ length: size * size }).fill(''));
        setEnd(false);
        setWinner('');
    }, [size, length])

    const onClickItem = useCallback((index) => {
        if (items[index] || end) {
            return;
        }
        setStepHistory(stepHistory.concat({
            index,
            size,
            items: items,
            sign: step % 2 === 0 ? 'X' : 'O',
            ...getXYFromIndex(index, size),
        }));
        setStep(step + 1);
        const newItems = items.map((item, i) => i === index ? step % 2 === 0 ? 'X' : 'O' : item);
        setItems(newItems);
        if (isWinner(newItems, step % 2 === 0 ? 'X' : 'O', index, size, length)) {
            setWinner(step % 2 === 0 ? 'X' : 'O');
            setEnd(true);
        }
    }, [stepHistory, items, step, winner, end]);

    const onClickReset = useCallback(() => {
        setStepHistory([]);
        setStep(0);
        setItems(Array.from({ length: size * size }).fill(''));
        setEnd(false);
        setWinner('');
    }, [stepHistory, items, step, winner, end]);

    const toStep = useCallback((index) => {
        setStepHistory(stepHistory.filter((item, i) => i < index));
        setStep(index);
        setItems(stepHistory[index].items);
        setEnd(false);
        setWinner('');
    }, [stepHistory, items, step, winner, end]);

    return {
        items,
        stepHistory,
        end,
        winner,
        step,
        onClickItem,
        onClickReset,
        toStep,
    };
}