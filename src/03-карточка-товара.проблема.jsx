import React, { useState } from 'react';

import './style.css';
function App() {
    const [currentImage, setCurrentImage] = useState('📦');
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const images = [
        { id: 1, src: '📦', alt: 'Основное изображение' },
        { id: 2, src: '🛍️', alt: 'Изображение 1' },
        { id: 3, src: '🎁', alt: 'Изображение 2' },
    ];

    const handleImageClick = (imageSrc) => {
        setCurrentImage(imageSrc);
    };

    const handleAddToCart = () => {
        setInCart(true);
        setTimeout(() => setInCart(false), 2000);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(10, value)));
    };

    return (
        <div className="product-page">
            <div className="product-gallery">
                <div className="main-image product-emoji">{currentImage}</div>
                <div className="thumbnails">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className={`thumbnail product-emoji ${currentImage === image.src ? 'active' : ''}`}
                            onClick={() => handleImageClick(image.src)}
                        >
                            {image.src}
                        </div>
                    ))}
                </div>
            </div>
            <div className="product-info">
                <h1>Название товара</h1>
                <p className="price">5000 ₽</p>
                <div className="rating">★★★★☆ (4.2)</div>

                <div className="quantity-selector">
                    <label htmlFor="quantity">Количество:</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="quantity-input"
                    />
                </div>

                <button
                    className={`add-to-cart-btn ${inCart ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={inCart}
                >
                    {inCart ? '✓ Добавлено в корзину!' : 'Добавить в корзину'}
                </button>

                <div className="product-description">
                    <h3>Описание товара</h3>
                    <p>
                        Высококачественный товар с отличными характеристиками. Идеально подходит для
                        повседневного использования. Гарантия качества и быстрая доставка.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
