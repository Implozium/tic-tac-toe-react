import React, { Component } from "react";

export default function GridItem({ value = '', index = 0, onClick = () => {} }) {
    return (
        <div className="grid__item" onClick={() => onClick(index, value)}>{ value }</div>
    );
}