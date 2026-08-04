import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/09-уведомления.проблема.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: шапка со счётчиком, список, само уведомление, его иконка
// и кнопка закрытия становятся отдельными компонентами.
describe('09 — уведомления', () => {
    const list = (container) => container.querySelectorAll('.notification');

    test('в заголовке счётчик непрочитанных', () => {
        render(<App />);

        expect(screen.getByText(/Уведомления \(1\)/)).toBeInTheDocument();
    });

    test('прочитанные и непрочитанные различаются', () => {
        const { container } = render(<App />);

        expect(list(container)[0]).toHaveClass('unread');
        expect(list(container)[1]).toHaveClass('read');
    });

    test('клик по уведомлению помечает его прочитанным', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(list(container)[0]);

        expect(list(container)[0]).toHaveClass('read');
        expect(screen.queryByText(/Уведомления \(1\)/)).toBeNull();
    });

    test('крестик удаляет уведомление, не помечая его прочитанным', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(container.querySelectorAll('.close-btn')[0]);

        expect(list(container)).toHaveLength(1);
        expect(screen.queryByText('Новое сообщение')).toBeNull();
    });

    test('кнопка помечает все прочитанными и гаснет', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const button = screen.getByRole('button', { name: /Пометить все как прочитанные/ });

        await user.click(button);

        expect([...list(container)].every((n) => n.classList.contains('read'))).toBe(true);
        expect(button).toBeDisabled();
    });

    test('у типов уведомлений разные иконки', () => {
        const { container } = render(<App />);
        const icons = [...container.querySelectorAll('.notification-icon')].map((i) =>
            i.textContent.trim()
        );

        expect(icons[0]).toBe('ℹ️');
        expect(icons[1]).toBe('⚠️');
    });

    test('список уведомлений разбит минимум на три компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует список целиком: вложенных компонентов ${parts.length}, а нужно минимум 3`
        ).toBeGreaterThanOrEqual(3);
    });
});
