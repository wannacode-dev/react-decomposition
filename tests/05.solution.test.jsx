// ⚙️ АВТОГЕНЕРАЦИЯ — не редактируй вручную.
// Это копия соседнего теста задания с импортом решения вместо проблемы.
// Правь исходный tests/NN.test.jsx и запусти: npm run play:generate

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/05-социальная-сеть.решение.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: лента разбирается на форму создания поста, сам пост,
// его шапку, панель действий и блок комментариев.
describe('05 — социальная сеть', () => {
    test('в ленте два поста', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('.post')).toHaveLength(2);
        expect(screen.getByText('Сегодня прекрасный день!')).toBeInTheDocument();
    });

    test('пустой пост опубликовать нельзя', () => {
        render(<App />);

        expect(screen.getByRole('button', { name: 'Опубликовать' })).toBeDisabled();
    });

    test('новый пост появляется в начале ленты', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Что у вас нового/), 'Первый пост');
        await user.click(screen.getByRole('button', { name: 'Опубликовать' }));

        const posts = container.querySelectorAll('.post');
        expect(posts).toHaveLength(3);
        expect(posts[0]).toHaveTextContent('Первый пост');
    });

    test('лайк увеличивает счётчик и закрашивает сердце', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const like = container.querySelectorAll('.like-btn')[0];

        expect(like).toHaveTextContent('15');
        await user.click(like);

        expect(container.querySelectorAll('.like-btn')[0]).toHaveTextContent('16');
        expect(container.querySelectorAll('.like-btn')[0]).toHaveClass('liked');
    });

    test('повторный клик снимает лайк', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(container.querySelectorAll('.like-btn')[0]);
        await user.click(container.querySelectorAll('.like-btn')[0]);

        expect(container.querySelectorAll('.like-btn')[0]).toHaveTextContent('15');
        expect(container.querySelectorAll('.like-btn')[0]).not.toHaveClass('liked');
    });

    test('комментарии скрыты, пока не нажали «Комментировать»', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        expect(container.querySelectorAll('.comments-section')).toHaveLength(0);
        await user.click(container.querySelectorAll('.comment-btn')[0]);

        expect(container.querySelectorAll('.comments-section')).toHaveLength(1);
        expect(screen.getByText(/Полностью согласен!/)).toBeInTheDocument();
    });

    test('комментарий добавляется к своему посту', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(container.querySelectorAll('.comment-btn')[0]);
        await user.type(screen.getByPlaceholderText(/Написать комментарий/), 'Хорошего дня');
        await user.click(screen.getByRole('button', { name: 'Отправить' }));

        expect(container.querySelectorAll('.comment')).toHaveLength(2);
        expect(container.querySelectorAll('.comment-btn')[0]).toHaveTextContent('(2)');
    });

    test('лента разбита минимум на четыре компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует ленту целиком: вложенных компонентов ${parts.length}, а нужно минимум 4`
        ).toBeGreaterThanOrEqual(4);
    });
});
