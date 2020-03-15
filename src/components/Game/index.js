import React, { Component, useState, useCallback } from "react";
import Cell from './Cell';
import History from './History';
import Config from './Config';
import useGame from './useGame';

export default function Game(props) {
    const [size, setSize] = useState(props.size);
    const [length, setLength] = useState(props.length);
    const {
        items,
        stepHistory,
        end,
        winner,
        step,
        onClickItem,
        onClickReset,
        toStep,
    } = useGame(size, length);

    const onChange = useCallback((size, length) => {
        console.log(size, length);
        setSize(size);
        setLength(length);
    }, [setSize, setLength]);

    const rItems = items
        .reduce((arr, item, i) => {
            if (arr.length === 0 || arr[arr.length - 1].length === size) {
                arr.push([]);
            }
            arr[arr.length - 1].push({ item, index: i });
            return arr;
        }, [])
        .map((chunk, i) => {
            return <div className="game__row" key={ i }>
                { chunk.map(({ item, index }) => <Cell key={ index } value={ item } index={ index } onClick={ onClickItem }></Cell>) }
            </div>;
        });

    const message = winner
        ? `Победитель ${winner}`
        : step === items.length
            ? 'Ничья'
            : step % 2 === 0
                ? 'Ходит крестик: X'
                : 'Ходит нолик: O';

    return <div className="game">
        <div className={ "game__body" + (end ? ' game__body_over' : '') }>
            <div className="game__title">Игра { size } x { size } ({ length } в ряд)</div>
            <div className={ "game__items" + (end ? '' : step % 2 === 0 ? ' game__items_x' : ' game__items_o') }>{ rItems }</div>
        </div>
        <div className="game__aside">
            <Config size={ props.size } length={ props.length } onChange={ onChange }></Config>
            <div className="game__info">{ message }</div>
            { !!step && <button className="game__button" onClick={ onClickReset }>Сбросить</button> }
            <History items={ stepHistory } onClick={ toStep }/>
        </div>
    </div>;
}

Game.defaultProps = {
    size: 3,
    length: 3,
};