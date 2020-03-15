import React, { useState, useCallback } from "react";
import Game from './Game';

export default function App(props) {
    return (
        <div>
            <Game size={ 5 } length={ 3 }></Game>
        </div>
    );
}