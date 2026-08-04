import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/08-чат-сообщениями.проблема.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: шапка чата, лента сообщений, само сообщение и поле
// ввода разъезжаются по компонентам.
describe('08 — чат с сообщениями', () => {
    test('шапка чата на месте', () => {
        render(<App />);

        expect(screen.getByText('Чат с Анной')).toBeInTheDocument();
        expect(screen.getByText('online')).toBeInTheDocument();
    });

    test('видны оба сообщения', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('.message')).toHaveLength(2);
        expect(screen.getByText('Привет! Как дела?')).toBeInTheDocument();
    });

    test('свои и чужие сообщения различаются', () => {
        const { container } = render(<App />);
        const messages = container.querySelectorAll('.message');

        expect(messages[0]).toHaveClass('other-message');
        expect(messages[1]).toHaveClass('own-message');
    });

    test('у чужого сообщения показан отправитель, у своего — нет', () => {
        const { container } = render(<App />);
        const messages = container.querySelectorAll('.message');

        expect(messages[0].querySelector('.sender')).toHaveTextContent('Анна');
        expect(messages[1].querySelector('.sender')).toBeNull();
    });

    test('кнопка отправляет сообщение и очищает поле', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const input = screen.getByPlaceholderText(/Введите сообщение/);

        await user.type(input, 'Как сам?');
        await user.click(screen.getByRole('button', { name: 'Отправить' }));

        expect(container.querySelectorAll('.message')).toHaveLength(3);
        expect(screen.getByText('Как сам?')).toBeInTheDocument();
        expect(input).toHaveValue('');
    });

    test('Enter тоже отправляет сообщение', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Введите сообщение/), 'Привет{Enter}');

        expect(container.querySelectorAll('.message')).toHaveLength(3);
    });

    test('пустое сообщение не отправляется', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(screen.getByRole('button', { name: 'Отправить' }));

        expect(container.querySelectorAll('.message')).toHaveLength(2);
    });

    test('чат разбит минимум на три компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует чат целиком: вложенных компонентов ${parts.length}, а нужно минимум 3`
        ).toBeGreaterThanOrEqual(3);
    });
});
