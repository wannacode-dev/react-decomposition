// ⚙️ АВТОГЕНЕРАЦИЯ — не редактируй вручную.
// Это копия соседнего теста задания с импортом решения вместо проблемы.
// Правь исходный tests/NN.test.jsx и запусти: npm run play:generate

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/12-история-действий.решение.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: шапка с фильтром, список, строка события и заглушка
// «ничего не найдено» — отдельные компоненты. Фильтрация по времени та же.
describe('12 — история действий', () => {
    const list = (container) => container.querySelectorAll('.activity-item');

    test('сначала показаны все события', () => {
        const { container } = render(<App />);

        expect(list(container)).toHaveLength(6);
        expect(screen.getByText(/История действий \(6\)/)).toBeInTheDocument();
    });

    test('у события есть иконка, текст и время', () => {
        const { container } = render(<App />);
        const first = list(container)[0];

        expect(first.querySelector('.activity-icon')).toHaveTextContent('🔐');
        expect(first).toHaveTextContent('Вы выполнили вход в систему');
        expect(first.querySelector('.activity-time')).toHaveTextContent('Сегодня, 10:30');
    });

    test('фильтр «За сегодня» оставляет только сегодняшние события', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.selectOptions(screen.getByRole('combobox'), 'today');

        expect(list(container)).toHaveLength(1);
        expect(list(container)[0]).toHaveTextContent('Вы выполнили вход в систему');
    });

    test('фильтр «За неделю» шире, чем «За сегодня»', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const select = screen.getByRole('combobox');

        await user.selectOptions(select, 'today');
        expect(list(container)).toHaveLength(1);

        await user.selectOptions(select, 'week');
        expect(list(container).length).toBeGreaterThan(1);
        expect(screen.getByText('Отредактирован профиль пользователя')).toBeInTheDocument();
    });

    test('счётчик в заголовке считает отфильтрованные события', async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.selectOptions(screen.getByRole('combobox'), 'today');

        expect(screen.getByText(/История действий \(1\)/)).toBeInTheDocument();
    });

    test('история разбита минимум на три компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует историю целиком: вложенных компонентов ${parts.length}, а нужно минимум 3`
        ).toBeGreaterThanOrEqual(3);
    });
});
