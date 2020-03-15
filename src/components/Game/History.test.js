import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import History, { HistoryItem } from "./History";

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

it("HistoryItem рендер и проверка клика", () => {
    const onChange = jest.fn();
    act(() => {
        render(<HistoryItem item={ { x: 1, y: 1, sign: 'X' } } index={ 2 } onClick={onChange} />, container);
    });
    expect(container.querySelector('li').textContent).toContain('X на (2, 2)');
    act(() => {
        container.querySelector('li button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith(2);
});

it("History рендер и проверка клика", () => {
    const onChange = jest.fn();
    act(() => {
        render(<History items={ [] } onClick={onChange} />, container);
    });
    expect(container.querySelector('div').textContent).toBe('');
    expect(container.querySelectorAll('li').length).toBe(0);

    const items = [
        { x: 1, y: 1, sign: 'X' },
        { x: 2, y: 2, sign: 'O' },
        { x: 0, y: 0, sign: 'X' },
        { x: 1, y: 0, sign: 'O' },
    ];
    act(() => {
        render(<History items={ items } onClick={onChange} />, container);
    });
    expect(container.querySelectorAll('li').length).toBe(4);
    expect(container.querySelectorAll('li')[2].textContent).toContain(`${items[2].sign} на (${items[2].x + 1}, ${items[2].y + 1})`);

    act(() => {
        container.querySelectorAll('li')[1].querySelector('button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith(1);
});