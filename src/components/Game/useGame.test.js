import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";
import { act as actHook, renderHook } from '@testing-library/react-hooks';
import useGame, { getXYFromIndex, isWinner } from "./useGame";

describe("Game провернка функции getXYFromIndex", () => {
    it("0 индекс для ширины 1", () => {
        expect(getXYFromIndex(0, 1)).toEqual({ x: 0, y: 0 });
    });
    it("10 индекс для ширины 10", () => {
        expect(getXYFromIndex(10, 10)).toEqual({ x: 0, y: 1 });
    });
    it("10 индекс для ширины 4", () => {
        expect(getXYFromIndex(10, 4)).toEqual({ x: 2, y: 2 });
    });
});

describe("Game провернка функции isWinner", () => {
    it("3x3 для первого хода X в поле (1, 1)", () => {
        expect(isWinner(['', '', '', '', 'X', '', '', '', ''], 'X', 4, 3, 3)).toBe(false);
    });
    it("3x3 для третьего хода в поле (0, 1)", () => {
        expect(isWinner(['', 'O', '', 'X', 'X', '', '', '', ''], 'X', 3, 3, 3)).toBe(false);
    });
    it("3x3 для игры X по горизонтали в поле (2, 1)", () => {
        expect(isWinner(['', 'O', '', 'X', 'X', 'X', 'O', '', ''], 'X', 5, 3, 3)).toBe(true);
    });
    it("3x3 для игры X по вертикали в поле (1, 0)", () => {
        expect(isWinner(['', 'X', '', 'O', 'X', 'O', '', 'X', ''], 'X', 1, 3, 3)).toBe(true);
    });
    it("3x3 для игры X по диагонали в поле (0, 0)", () => {
        expect(isWinner(['X', 'O', '', '', 'X', '', '', 'O', 'X'], 'X', 0, 3, 3)).toBe(true);
    });
    it("3x3 для игры X по обратной диагонали в поле (2, 0)", () => {
        expect(isWinner(['', 'O', 'X', 'O', 'X', '', 'X', '', ''], 'X', 2, 3, 3)).toBe(true);
    });
    it("3x3 для игры O для конца хода в поле (0, 0)", () => {
        expect(isWinner(['O', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'], 'O', 0, 3, 3)).toBe(false);
    });
});

describe("useGame", () => {
    it("Инициализация", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useGame(3, 3));
        expect(result.current.items.length).toBe(9);
        actHook(() => {
            result.current.onClickItem(0);
        });
        expect(result.current.items[0]).toBe('X');
        actHook(() => {
            result.current.onClickItem(1);
        });
        expect(result.current.items[1]).toBe('O');
        actHook(() => {
            result.current.onClickItem(1);
        });
        expect(result.current.items[1]).toBe('O');
        actHook(() => {
            result.current.onClickItem(2);
        });
        expect(result.current.items[2]).toBe('X');
        expect(result.current.step).toBe(3);
        expect(result.current.stepHistory.length).toBe(3);
        actHook(() => {
            result.current.toStep(2);
        });
        expect(result.current.items[2]).toBe('');
        expect(result.current.step).toBe(2);
        expect(result.current.stepHistory.length).toBe(2);
        actHook(() => {
            result.current.onClickReset();
        });
        expect(result.current.items.every(v => !v)).toBe(true);
        expect(result.current.step).toBe(0);
        expect(result.current.stepHistory.length).toBe(0);
    });
    it("Победа", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useGame(3, 3));
        actHook(() => {
            result.current.onClickItem(0);
        });
        actHook(() => {
            result.current.onClickItem(3);
        });
        actHook(() => {
            result.current.onClickItem(1);
        });
        actHook(() => {
            result.current.onClickItem(4);
        });
        actHook(() => {
            result.current.onClickItem(2);
        });
        expect(result.current.winner).toBe('X');
        expect(result.current.end).toBe(true);
    });
});