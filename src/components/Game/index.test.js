import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Game from "./index";

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

describe('Game', () => {
    it("рендер 5x5", () => {
        const onChange = jest.fn();
        act(() => {
            render(<Game size={ 5 } length={ 5 } />, container);
        });
        expect(container.querySelectorAll('.game__item').length).toBe(25);
    });

    it("рендер 3x3", () => {
        act(() => {
            render(<Game size={ 3 } length={ 3 } />, container);
        });
        expect(container.querySelectorAll('.game__item').length).toBe(9);
    });

    it("клики по полю и кнопка сброс", () => {
        act(() => {
            render(<Game size={ 3 } length={ 3 } />, container);
        });
        expect(container.querySelectorAll('.game__history li').length).toBe(0);

        act(() => {
            container.querySelectorAll('.game__item')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');

        act(() => {
            container.querySelectorAll('.game__item')[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(container.querySelectorAll('.game__item')[1].textContent).toBe('O');

        act(() => {
            container.querySelectorAll('.game__item')[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(container.querySelectorAll('.game__item')[2].textContent).toBe('X');
        expect(container.querySelectorAll('.game__history li').length).toBe(3);

        act(() => {
            container.querySelector('.game__button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(container.querySelectorAll('.game__item')[0].textContent).toBe('');
        expect(container.querySelectorAll('.game__item')[2].textContent).toBe('');
        expect(container.querySelectorAll('.game__item')[2].textContent).toBe('');
        expect(container.querySelectorAll('.game__history li').length).toBe(0);
    });

    it("возвращение по истории", () => {
        act(() => {
            render(<Game size={ 3 } length={ 3 } />, container);
        });
        expect(container.querySelectorAll('.game__history li').length).toBe(0);

        act(() => {
            container.querySelectorAll('.game__item')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        act(() => {
            container.querySelectorAll('.game__item')[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');
        expect(container.querySelectorAll('.game__item')[1].textContent).toBe('O');

        act(() => {
            container.querySelectorAll('.game__history li')[1].querySelector('button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');
        expect(container.querySelectorAll('.game__item')[1].textContent).toBe('');
        expect(container.querySelectorAll('.game__history li').length).toBe(1);
    });

    it("выигрыш и клики по полю после", () => {
        const onChange = jest.fn();
        act(() => {
            render(<Game size={ 3 } length={ 3 } />, container);
        });

        act(() => {
            container.querySelectorAll('.game__item')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        act(() => {
            container.querySelectorAll('.game__item')[3].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        act(() => {
            container.querySelectorAll('.game__item')[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        act(() => {
            container.querySelectorAll('.game__item')[4].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        act(() => {
            container.querySelectorAll('.game__item')[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        act(() => {
            container.querySelectorAll('.game__item')[5].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');
        expect(container.querySelectorAll('.game__item')[1].textContent).toBe('X');
        expect(container.querySelectorAll('.game__item')[2].textContent).toBe('X');
        expect(container.querySelectorAll('.game__item')[3].textContent).toBe('O');
        expect(container.querySelectorAll('.game__item')[4].textContent).toBe('O');
        expect(container.querySelectorAll('.game__item')[5].textContent).toBe('');
        expect(container.querySelectorAll('.game__history li').length).toBe(5);
        expect(container.querySelector('.game__info').textContent).toBe('Победитель X');
    });
});