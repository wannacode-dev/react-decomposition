// ⚙️ АВТОГЕНЕРАЦИЯ — не редактируй вручную.
// Это копия соседнего теста задания с импортом решения вместо проблемы.
// Правь исходный tests/NN.test.jsx и запусти: npm run play:generate

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/02-список-задач.решение.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: заголовок, список, строка списка и форма ввода
// разъезжаются по своим компонентам. Поведение обязано остаться прежним.
describe('02 — список задач', () => {
    test('в заголовке счётчик выполненных', () => {
        render(<App />);

        expect(screen.getByText(/Мои задачи \(1\/2\)/)).toBeInTheDocument();
    });

    test('обе задачи в списке', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('.todo-list li')).toHaveLength(2);
        expect(screen.getByText('Купить молоко')).toBeInTheDocument();
    });

    test('чекбокс переключает задачу и обновляет счётчик', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(container.querySelectorAll('.todo-checkbox')[0]);

        expect(screen.getByText(/Мои задачи \(2\/2\)/)).toBeInTheDocument();
        expect(container.querySelectorAll('.todo-list li')[0]).toHaveClass('completed');
    });

    test('кнопка удаляет задачу', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(screen.getAllByRole('button', { name: 'Удалить' })[0]);

        expect(container.querySelectorAll('.todo-list li')).toHaveLength(1);
        expect(screen.queryByText('Купить молоко')).toBeNull();
    });

    test('пустое поле не даёт добавить задачу', () => {
        render(<App />);

        expect(screen.getByRole('button', { name: 'Добавить' })).toBeDisabled();
    });

    test('новая задача добавляется и поле очищается', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const input = screen.getByPlaceholderText(/Новая задача/);

        await user.type(input, 'Написать тест');
        await user.click(screen.getByRole('button', { name: 'Добавить' }));

        expect(container.querySelectorAll('.todo-list li')).toHaveLength(3);
        expect(screen.getByText('Написать тест')).toBeInTheDocument();
        expect(input).toHaveValue('');
    });

    test('когда задач не осталось — сообщение «Нет задач»', async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getAllByRole('button', { name: 'Удалить' })[0]);
        await user.click(screen.getAllByRole('button', { name: 'Удалить' })[0]);

        expect(screen.getByText('Нет задач')).toBeInTheDocument();
    });

    test('список разбит минимум на три компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё делает всё сам: вложенных компонентов ${parts.length}, а нужно минимум 3 (заголовок, список/строка, форма)`
        ).toBeGreaterThanOrEqual(3);
    });
});
