import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { act as actHook, renderHook } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';

import Config, { useConfig } from "./Config";

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

describe('useConfig', () => {
    it("проверка правильности влияния зависимостей", () => {
        const { result, waitForNextUpdate } = renderHook(() => useConfig(3, 3));
        expect(result.current.size).toBe(3);
        expect(result.current.length).toBe(3);
        expect(result.current.minSize).toBe(3);
        expect(result.current.maxLength).toBe(3);
        // expect(result.current.maxSize).toBe(20);

        actHook(() => {
            result.current.setRightSize(0);
        });
        expect(result.current.size).toBe(3);

        actHook(() => {
            result.current.setRightSize(10);
        });
        expect(result.current.size).toBe(10);
        expect(result.current.maxLength).toBe(10);

        actHook(() => {
            result.current.setRightLength(0);
        });
        expect(result.current.length).toBe(3);

        actHook(() => {
            result.current.setRightLength(5);
        });
        expect(result.current.length).toBe(5);
        expect(result.current.minSize).toBe(5);
    });
});

describe('Config', () => {
    it("создание и проверка кликов", () => {
        const onChange = jest.fn();
        act(() => {
            render(<Config size={ 5 } length={ 3 } onChange={ onChange } />, container);
        });
        expect(container.querySelectorAll('select[name="size"] option').length).toBe(20 - 2);
        expect(container.querySelectorAll('select[name="length"] option').length).toBe(4);
        expect(container.querySelector('select[name="size"]').value).toBe('5');
        expect(container.querySelector('select[name="length"]').value).toBe('3');
        act(() => {
            // container.querySelectorAll('select[name="size"] option')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
            fireEvent.change(container.querySelector('select[name="size"]'), { target: { value: '3' } });
        });
        expect(container.querySelector('select[name="size"]').value).toBe('3');
    });
});

//     it("рендер 3x3", () => {
//         act(() => {
//             render(<Game size={ 3 } length={ 3 } />, container);
//         });
//         expect(container.querySelectorAll('.game__item').length).toBe(9);
//     });

//     it("клики по полю и кнопка сброс", () => {
//         act(() => {
//             render(<Game size={ 3 } length={ 3 } />, container);
//         });
//         expect(container.querySelectorAll('.game__history li').length).toBe(0);

//         act(() => {
//             container.querySelectorAll('.game__item')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });
//         expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');

//         act(() => {
//             container.querySelectorAll('.game__item')[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });
//         expect(container.querySelectorAll('.game__item')[1].textContent).toBe('O');

//         act(() => {
//             container.querySelectorAll('.game__item')[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });
//         expect(container.querySelectorAll('.game__item')[2].textContent).toBe('X');
//         expect(container.querySelectorAll('.game__history li').length).toBe(3);

//         act(() => {
//             container.querySelector('.game__button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });
//         expect(container.querySelectorAll('.game__item')[0].textContent).toBe('');
//         expect(container.querySelectorAll('.game__item')[2].textContent).toBe('');
//         expect(container.querySelectorAll('.game__item')[2].textContent).toBe('');
//         expect(container.querySelectorAll('.game__history li').length).toBe(0);
//     });

//     it("возвращение по истории", () => {
//         act(() => {
//             render(<Game size={ 3 } length={ 3 } />, container);
//         });
//         expect(container.querySelectorAll('.game__history li').length).toBe(0);

//         act(() => {
//             container.querySelectorAll('.game__item')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });
//         expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');
//         expect(container.querySelectorAll('.game__item')[1].textContent).toBe('O');

//         act(() => {
//             container.querySelectorAll('.game__history li')[1].querySelector('button').dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });
//         expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');
//         expect(container.querySelectorAll('.game__item')[1].textContent).toBe('');
//         expect(container.querySelectorAll('.game__history li').length).toBe(1);
//     });

//     it("выигрыш и клики по полю после", () => {
//         const onChange = jest.fn();
//         act(() => {
//             render(<Game size={ 3 } length={ 3 } />, container);
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[3].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[4].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         act(() => {
//             container.querySelectorAll('.game__item')[5].dispatchEvent(new MouseEvent("click", { bubbles: true }));
//         });

//         expect(container.querySelectorAll('.game__item')[0].textContent).toBe('X');
//         expect(container.querySelectorAll('.game__item')[1].textContent).toBe('X');
//         expect(container.querySelectorAll('.game__item')[2].textContent).toBe('X');
//         expect(container.querySelectorAll('.game__item')[3].textContent).toBe('O');
//         expect(container.querySelectorAll('.game__item')[4].textContent).toBe('O');
//         expect(container.querySelectorAll('.game__item')[5].textContent).toBe('');
//         expect(container.querySelectorAll('.game__history li').length).toBe(5);
//         expect(container.querySelector('.game__info').textContent).toBe('Победитель X');
//     });
// });