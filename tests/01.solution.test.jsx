// ⚙️ АВТОГЕНЕРАЦИЯ — не редактируй вручную.
// Это копия соседнего теста задания с импортом решения вместо проблемы.
// Правь исходный tests/NN.test.jsx и запусти: npm run play:generate

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/01-профиль-пользователя.решение.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: разметка та же, но App перестаёт рисовать всё сам —
// шапка профиля и детали становятся отдельными компонентами. Поэтому проверок
// две пары: экран не сломался + экран действительно разбит на части.
describe('01 — профиль пользователя', () => {
    test('видно имя и роль', () => {
        render(<App />);

        expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
        expect(screen.getByText('Frontend-разработчик')).toBeInTheDocument();
    });

    test('видно аватар', () => {
        const { container } = render(<App />);
        const avatar = container.querySelector('.avatar-emoji');

        expect(avatar, 'нет блока с классом «avatar-emoji»').not.toBeNull();
        expect(avatar.textContent.trim()).not.toBe('');
    });

    test('видно контакты', () => {
        render(<App />);

        expect(screen.getByText(/ivan@example\.com/)).toBeInTheDocument();
        expect(screen.getByText(/\+7 999 123-45-67/)).toBeInTheDocument();
    });

    test('кнопка редактирования на месте', () => {
        render(<App />);

        expect(screen.getByRole('button', { name: /Редактировать профиль/ })).toBeInTheDocument();
    });

    test('шапка и детали профиля вынесены в отдельные компоненты', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует профиль целиком: вложенных компонентов ${parts.length}, а нужно минимум 2`
        ).toBeGreaterThanOrEqual(2);
    });
});
