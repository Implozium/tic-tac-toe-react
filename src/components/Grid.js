import React, { Component } from "react";
import GridItem from './GridItem';

export default class Grid extends Component {
    constructor(props) {
        super(props);
        const {
            size,
            length,
        } = props;

        this.state = {
            ...this.getDefault(size, length),
        };

        this.onClickItem = this.onClickItem.bind(this);
        this.onClickReset = this.onClickReset.bind(this);
    }

    getDefault(size, length) {
        return {
            size,
            length,
            items: Array.from({ length: size * size }).fill(''),
            stepHistory: [],
            end: false,
            winner: '',
            step: 0,
        };
    }

    onClickItem(index, value) {
        if (value || this.state.end) {
            return;
        }
        // check win algorithm
        // add history
        this.setState({
            stepHistory: this.state.stepHistory.concat({
                items: this.state.items,
                sign: this.state.step % 2 === 0 ? 'X' : 'O',
                ...this.getXYFromIndex(index),
            }),
            step: this.state.step + 1,
            items: this.state.items.map((item, i) => i === index ? this.state.step % 2 === 0 ? 'X' : 'O' : item),
        }, () => {
            if (this.isWinner(this.state.step % 2 === 1 ? 'X' : 'O', index)) {
                this.setState({
                    winner: this.state.step % 2 === 1 ? 'X' : 'O',
                    end: true,
                });
            }
        });
    }

    toStep(index) {
        this.setState({
            stepHistory: this.state.stepHistory.filter((item, i) => i < index),
            step: index,
            items: this.state.stepHistory[index].items,
            end: false,
            winner: '',
        });
    }

    getValByXY(x, y) {
        if (x < 0 || x >= this.state.size || y < 0 || y >= this.state.size) {
            return '';
        }
        return this.state.items[y * this.state.size + x];
    }

    getXYFromIndex(index) {
        return {
            x: index % this.state.size,
            y: Math.floor(index / this.state.size),
        };
    }

    isWinner(sign, index) {
        const { x, y } = this.getXYFromIndex(index);
        const directions = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
        ];

        return directions.some((direction) => {
            let count = 1;
            let xTo = x;
            let yTo = y;
            while (this.getValByXY(xTo + direction[0], yTo + direction[1]) === sign) {
                count++;
                xTo += direction[0];
                yTo += direction[1];
            }
            xTo = x;
            yTo = y;
            while (this.getValByXY(xTo - direction[0], yTo - direction[1]) === sign) {
                count++;
                xTo -= direction[0];
                yTo -= direction[1];
            }
            return count >= this.state.length;
        });
    }

    onClickReset() {
        this.setState(this.getDefault(this.state.size, this.state.length));
    }

    render() {
        const items = this.state.items
            .reduce((arr, item, i) => {
                if (arr.length === 0 || arr[arr.length - 1].length === this.state.size) {
                    arr.push([]);
                }
                arr[arr.length - 1].push({ item, index: i });
                return arr;
            }, [])
            .map((chunk, i) => {
                return <div className="grid__row" key={ i }>
                    { chunk.map(({ item, index }) => <GridItem key={ index } value={ item } index={ index } onClick={ this.onClickItem }></GridItem>) }
                </div>;
            });
        const message = this.state.winner
            ? `Победитель ${this.state.winner}`
            : this.state.step === this.state.items.length
                ? 'Ничья'
                : this.state.step % 2 === 0
                    ? 'Ходит крестик: X'
                    : 'Ходит нолик: O';
        const history = this.state.stepHistory.map((aStepHistory, i) => {
            return <li key={ i }>
                { aStepHistory.sign } на ({ aStepHistory.x + 1 }, { aStepHistory.y + 1 })
                <button onClick={ () => this.toStep(i) }>до этого шага</button>
            </li>;
        });

        return <div className="grid">
            <div className="grid__body">
                <div className="grid__title">Игра { this.state.size } x { this.state.size } ({ this.state.length } в ряд)</div>
                <div className="grid__items">{ items }</div>
                <div className="grid__footer">
                    <div className="grid__info">{ message }</div>
                    <button className="grid__button" onClick={ this.onClickReset }>{ 'Сбросить' }</button>
                </div>
            </div>
            <div className="grid__history">
                { !!history.length && 'История:' }
                <ol>{ history }</ol>
            </div>
        </div>;
    }
}

Grid.defaultProps = {
    size: 3,
    length: 3,
};