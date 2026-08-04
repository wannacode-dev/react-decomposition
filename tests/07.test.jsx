import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/07-фильтр-и-поиск.проблема.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: поиск, выбор категории и чекбокс наличия становятся
// отдельными компонентами, карточка товара — своим. Фильтрация не меняется.
describe('07 — фильтр и поиск', () => {
    const items = (container) => container.querySelectorAll('.product-item');

    test('сначала показаны оба товара', () => {
        const { container } = render(<App />);

        expect(items(container)).toHaveLength(2);
    });

    test('поиск отбирает товары по названию', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.type(screen.getByPlaceholderText(/Поиск товаров/), 'ноут');

        expect(items(container)).toHaveLength(1);
        expect(items(container)[0]).toHaveTextContent('Ноутбук');
    });

    test('фильтр по категории работает', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.selectOptions(screen.getByRole('combobox'), 'Одежда');

        expect(items(container)).toHaveLength(1);
        expect(items(container)[0]).toHaveTextContent('Футболка');
    });

    test('чекбокс оставляет только товары в наличии', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(screen.getByRole('checkbox'));

        expect(items(container)).toHaveLength(1);
        expect(items(container)[0]).toHaveTextContent('Ноутбук');
    });

    test('фильтры складываются друг с другом', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.selectOptions(screen.getByRole('combobox'), 'Одежда');
        await user.click(screen.getByRole('checkbox'));

        expect(items(container)).toHaveLength(0);
    });

    test('наличие подписано и покрашено', () => {
        const { container } = render(<App />);

        expect(container.querySelector('.in-stock')).toHaveTextContent('В наличии');
        expect(container.querySelector('.out-of-stock')).toHaveTextContent('Нет в наличии');
    });

    test('фильтры и карточка товара вынесены в компоненты', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует всё сам: вложенных компонентов ${parts.length}, а нужно минимум 4`
        ).toBeGreaterThanOrEqual(4);
    });
});
