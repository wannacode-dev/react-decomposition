// ⚙️ АВТОГЕНЕРАЦИЯ — не редактируй вручную.
// Это копия соседнего теста задания с импортом решения вместо проблемы.
// Правь исходный tests/NN.test.jsx и запусти: npm run play:generate

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/10-комментарии-к-посту.решение.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: шапка, список, сам комментарий, его действия и форма
// ответа разъезжаются по компонентам.
describe('10 — комментарии к посту', () => {
    const list = (container) => container.querySelectorAll('.comment');

    test('в заголовке количество комментариев', () => {
        render(<App />);

        expect(screen.getByText(/Комментарии \(2\)/)).toBeInTheDocument();
    });

    test('оба комментария на месте с автором и временем', () => {
        const { container } = render(<App />);

        expect(list(container)).toHaveLength(2);
        expect(screen.getByText('Алексей')).toBeInTheDocument();
        expect(screen.getByText('Отличная статья!')).toBeInTheDocument();
        expect(screen.getByText('2 часа назад')).toBeInTheDocument();
    });

    test('лайк увеличивает счётчик и подсвечивает кнопку', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const like = list(container)[0].querySelector('.comment-actions button');

        expect(like).toHaveTextContent('5');
        await user.click(like);

        const updated = list(container)[0].querySelector('.comment-actions button');
        expect(updated).toHaveTextContent('6');
        expect(updated).toHaveClass('liked');
    });

    test('«Ответить» подставляет обращение в поле ввода', async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.click(screen.getAllByRole('button', { name: 'Ответить' })[1]);

        expect(screen.getByPlaceholderText(/Оставьте ваш комментарий/)).toHaveValue('@Мария ');
    });

    test('пустой комментарий отправить нельзя', () => {
        render(<App />);

        expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
    });

    test('комментарий добавляется в конец списка', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Оставьте ваш комментарий/), 'Согласен');
        await user.click(screen.getByRole('button', { name: 'Отправить' }));

        expect(list(container)).toHaveLength(3);
        expect(list(container)[2]).toHaveTextContent('Согласен');
        expect(screen.getByText(/Комментарии \(3\)/)).toBeInTheDocument();
    });

    test('Ctrl+Enter тоже отправляет комментарий', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Оставьте ваш комментарий/), 'Ага');
        await user.keyboard('{Control>}{Enter}{/Control}');

        expect(list(container)).toHaveLength(3);
    });

    test('комментарии разбиты минимум на три компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует комментарии целиком: вложенных компонентов ${parts.length}, а нужно минимум 3`
        ).toBeGreaterThanOrEqual(3);
    });
});
