import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Cell from "./Cell";

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("Cell рендер и проверка клика", () => {
    const onChange = jest.fn();
    act(() => {
        render(<Cell value={ '' } index={ 0 } onClick={onChange} />, container);
    });
    expect(container.querySelector('div').textContent).toBe('');

    act(() => {
        container.querySelector('div').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith(0);

    act(() => {
        render(<Cell value={ 'X' } index={ 10 } onClick={onChange} />, container);
    });
    expect(container.querySelector('div').textContent).toBe('X');

    act(() => {
        container.querySelector('div').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith(10);
});