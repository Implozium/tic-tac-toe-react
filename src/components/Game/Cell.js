import React, { useCallback } from "react";

export default function Cell({ value = '', index = 0, onClick = () => {} }) {
    const onClickCallback = useCallback(() => onClick(index), [index, onClick]);

    return (
        <div className={ "game__item" + (value === 'X' ? ' game__item_x' : value === 'O' ? ' game__item_o' : '') } onClick={ onClickCallback }>{ value }</div>
    );
}