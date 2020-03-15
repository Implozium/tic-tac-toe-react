import React, { useState, useCallback, useEffect } from "react";

/**
 * 
 * @param {number} defaultSize 
 * @param {number} defaultLength 
 * @return {{
        size: number,
        length: number,
        setRightSize: function (number): void,
        setRightLength: function (number): void,
        minSize: number,
        maxSize: number,
        minLength: number,
        maxLength: number,
    }}
 */
export function useConfig(defaultSize, defaultLength) {
    const [size, setSize] = useState(defaultSize);
    const [length, setLength] = useState(defaultLength);
    const minSize = Math.max(2, length);
    const maxSize = 20;
    const minLength = 2;
    const maxLength = size;

    useEffect(() => {
        setSize(defaultSize);
        setLength(defaultLength);
    }, [defaultSize, defaultLength]);

    const setRightSize = useCallback((value) => {
        if (value >= minSize && value >= length && value <= maxSize) {
            setSize(value);
        }
    }, [length]);

    const setRightLength = useCallback((value) => {
        if (value > minLength && value <= size) {
            setLength(value);
        }
    }, [size]);

    return {
        size,
        length,
        setRightSize,
        setRightLength,
        minSize,
        maxSize,
        minLength,
        maxLength,
    };
}

export default function Config({ onChange = () => {}, ...props }) {
    const {
        size,
        length,
        setRightSize,
        setRightLength,
        minSize,
        maxSize,
        minLength,
        maxLength,
    } = useConfig(props.size, props.length);

    useEffect(() => {
        onChange(size, length);
    }, [size, length]);

    const setSize = useCallback((e) => {
        setRightSize(parseInt(e.target.value) || 0);
    }, [setRightSize]);
    const setLength = useCallback((e) => {
        setRightLength(parseInt(e.target.value) || 0);
    }, [setRightLength]);

    const sizeOptions = [];
    for (let i = minSize; i <= maxSize; i++) {
        sizeOptions.push(<option key={ i } value={ i }>{ i }</option>);
    }

    const lengthOptions = [];
    for (let i = minLength; i <= maxLength; i++) {
        lengthOptions.push(<option key={ i } value={ i }>{ i }</option>);
    }

    return (
        <div>
            <div className="field">
                <label className="field__container">
                    <span className="field__label">Размер поля</span>
                    <select name="size" onChange={ setSize } value={ size } className="field__input field__input_select">{ sizeOptions }</select>
                </label>
            </div>
            <div className="field">
                <label className="field__container" title="количество X или O в непрерывной прямой, необходимых для победы">
                    <span className="field__label">Количество в ряд</span>
                    <select name="length" onChange={ setLength } value={ length } className="field__input field__input_select">{ lengthOptions }</select>
                </label>
            </div>
        </div>
    );
}