import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/06-форма-регистрации.проблема.jsx';
import { renderTree, componentTypes, components } from './helpers/structure.jsx';

// Задание-рефакторинг: четыре одинаковых блока «label + input» — это один
// переиспользуемый компонент поля, а не копипаста.
describe('06 — форма регистрации', () => {
    test('заголовок формы на месте', () => {
        render(<App />);

        expect(screen.getByText('Регистрация')).toBeInTheDocument();
    });

    test('все четыре поля на месте', () => {
        const { container } = render(<App />);

        expect(container.querySelectorAll('.form-group')).toHaveLength(4);
        expect(screen.getByPlaceholderText('Введите ваше имя')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Введите ваш email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Придумайте пароль')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Повторите пароль')).toBeInTheDocument();
    });

    test('у полей правильные типы', () => {
        render(<App />);

        expect(screen.getByPlaceholderText('Введите ваш email')).toHaveAttribute('type', 'email');
        expect(screen.getByPlaceholderText('Придумайте пароль')).toHaveAttribute(
            'type',
            'password'
        );
        expect(screen.getByPlaceholderText('Повторите пароль')).toHaveAttribute('type', 'password');
    });

    test('подписи полей на месте', () => {
        render(<App />);

        for (const label of ['Имя', 'Email', 'Пароль', 'Подтверждение пароля']) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    });

    test('кнопка отправки и ссылка на вход', () => {
        render(<App />);

        expect(screen.getByRole('button', { name: /Зарегистрироваться/ })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', '/login');
    });

    test('поля формы — переиспользуемый компонент, а не копипаста', () => {
        const root = renderTree(<App />);
        const repeated = componentTypes(root).filter(
            (type) => components(root).filter((c) => c.type === type).length >= 4
        );

        expect(
            repeated.length,
            'ни один компонент не отрисован 4 раза: блоки «label + input» всё ещё скопированы вручную'
        ).toBeGreaterThanOrEqual(1);
    });

    test('форма разбита минимум на два компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `вложенных компонентов ${parts.length}, а нужно минимум 2`
        ).toBeGreaterThanOrEqual(2);
    });
});
