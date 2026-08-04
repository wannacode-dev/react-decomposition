// ⚙️ АВТОГЕНЕРАЦИЯ — не редактируй вручную.
// Это копия соседнего теста задания с импортом решения вместо проблемы.
// Правь исходный tests/NN.test.jsx и запусти: npm run play:generate

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/11-список-контактов.решение.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: шапка с поиском, строка контакта, его аватар с
// индикатором статуса и заглушка «ничего не найдено» — отдельные компоненты.
describe('11 — список контактов', () => {
    const list = (container) => container.querySelectorAll('.contact');

    test('все контакты на месте, в заголовке их число', () => {
        const { container } = render(<App />);

        expect(list(container)).toHaveLength(5);
        expect(screen.getByText(/Контакты \(5\)/)).toBeInTheDocument();
    });

    test('поиск фильтрует контакты и обновляет счётчик', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Поиск контактов/), 'мария');

        expect(list(container)).toHaveLength(1);
        expect(list(container)[0]).toHaveTextContent('Мария Козлова');
        expect(screen.getByText(/Контакты \(1\)/)).toBeInTheDocument();
    });

    test('когда никто не найден — заглушка', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Поиск контактов/), 'ццц');

        expect(list(container)).toHaveLength(0);
        expect(screen.getByText('Контакты не найдены')).toBeInTheDocument();
    });

    test('статус онлайн отмечен на аватаре', () => {
        const { container } = render(<App />);

        expect(list(container)[0].querySelector('.status')).toHaveClass('online');
        expect(list(container)[1].querySelector('.status')).toHaveClass('offline');
    });

    test('офлайн-контакт подписан временем последнего визита', () => {
        const { container } = render(<App />);

        expect(list(container)[0].querySelector('.status-text')).toHaveTextContent('online');
        expect(list(container)[1].querySelector('.status-text')).toHaveTextContent(/2 часа назад/);
    });

    test('у каждого контакта есть кнопка «Написать»', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('.message-btn')).toHaveLength(5);
    });

    test('список контактов разбит минимум на три компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует список целиком: вложенных компонентов ${parts.length}, а нужно минимум 3`
        ).toBeGreaterThanOrEqual(3);
    });
});
