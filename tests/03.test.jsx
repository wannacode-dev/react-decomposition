import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/03-карточка-товара.проблема.jsx';
import { renderTree, componentTypes } from './helpers/structure.jsx';

// Задание-рефакторинг: галерея, шапка товара, выбор количества, кнопка корзины
// и описание становятся отдельными компонентами.
describe('03 — карточка товара', () => {
    test('сначала показано основное изображение', () => {
        const { container } = render(<App />);

        expect(container.querySelector('.main-image')).toHaveTextContent('📦');
    });

    test('клик по миниатюре меняет основное изображение', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(container.querySelectorAll('.thumbnail')[2]);

        expect(container.querySelector('.main-image')).toHaveTextContent('🎁');
    });

    test('выбранная миниатюра подсвечена', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);

        await user.click(container.querySelectorAll('.thumbnail')[1]);

        expect(container.querySelectorAll('.thumbnail')[1]).toHaveClass('active');
        expect(container.querySelectorAll('.thumbnail.active')).toHaveLength(1);
    });

    test('название, цена и рейтинг на месте', () => {
        render(<App />);

        expect(screen.getByText('Название товара')).toBeInTheDocument();
        expect(screen.getByText('5000 ₽')).toBeInTheDocument();
        expect(screen.getByText(/4\.2/)).toBeInTheDocument();
    });

    test('количество не выходит за границы 1..10', () => {
        const { container } = render(<App />);
        const input = container.querySelector('.quantity-input');

        fireEvent.change(input, { target: { value: '15' } });
        expect(input).toHaveValue(10);

        fireEvent.change(input, { target: { value: '0' } });
        expect(input).toHaveValue(1);
    });

    test('кнопка добавляет товар в корзину', async () => {
        const user = userEvent.setup();
        const { container } = render(<App />);
        const button = container.querySelector('.add-to-cart-btn');

        expect(button).toHaveTextContent('Добавить в корзину');
        await user.click(button);

        expect(container.querySelector('.add-to-cart-btn')).toHaveTextContent(
            'Добавлено в корзину'
        );
        expect(container.querySelector('.add-to-cart-btn')).toBeDisabled();
    });

    test('описание товара на месте', () => {
        render(<App />);

        expect(screen.getByText('Описание товара')).toBeInTheDocument();
    });

    test('карточка разбита минимум на четыре компонента', () => {
        const root = renderTree(<App />);
        const parts = componentTypes(root);

        expect(
            parts.length,
            `App всё ещё рисует карточку целиком: вложенных компонентов ${parts.length}, а нужно минимум 4`
        ).toBeGreaterThanOrEqual(4);
    });
});
