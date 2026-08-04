import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/04-панель-управления.проблема.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: шапка, карточки статистики, таблица заказов, строка
// заказа и бейдж статуса разъезжаются по компонентам. Сортировка обязана
// работать как раньше.
describe('04 — панель управления', () => {
    const idsInTable = (container) =>
        [...container.querySelectorAll('tbody tr')].map((tr) => tr.querySelector('td').textContent);

    test('заголовок панели на месте', () => {
        render(<App />);

        expect(screen.getByText('Панель управления')).toBeInTheDocument();
    });

    test('три карточки статистики', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('.stat-card')).toHaveLength(3);
        expect(screen.getByText('Пользователи')).toBeInTheDocument();
        expect(screen.getByText('Выручка')).toBeInTheDocument();
    });

    test('в таблице все пять заказов', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
    });

    test('сначала заказы отсортированы по дате, новые сверху', () => {
        const { container } = render(<App />);

        expect(idsInTable(container)[0]).toBe('#12345');
    });

    test('клик по «Сумма» сортирует по возрастанию суммы', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(screen.getByText(/Сумма/));

        expect(idsInTable(container)).toEqual(['#12348', '#12346', '#12345', '#12347', '#12349']);
    });

    test('повторный клик разворачивает сортировку', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(screen.getByText(/Сумма/));
        await user.click(screen.getByText(/Сумма/));

        expect(idsInTable(container)[0]).toBe('#12349');
    });

    test('статусы переведены на русский', () => {
        const { container } = render(<App />);
        const badges = [...container.querySelectorAll('.status-badge')].map((b) => b.textContent);

        expect(badges).toContain('Завершен');
        expect(badges).toContain('В обработке');
        expect(badges).toContain('Отменен');
    });

    test('панель разбита минимум на четыре компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует панель целиком: вложенных компонентов ${parts.length}, а нужно минимум 4`
        ).toBeGreaterThanOrEqual(4);
    });
});
