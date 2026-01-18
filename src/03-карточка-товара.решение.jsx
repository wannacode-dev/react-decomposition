import React, { useState } from 'react';

import './style.css';

function Thumbnail({ image, isActive, onClick }) {
    return (
        <div
            className={`thumbnail product-emoji ${isActive ? 'active' : ''}`}
            onClick={() => onClick(image.src)}
        >
            {image.src}
        </div>
    );
}

function Gallery({ currentImage, onImageClick, images }) {
    return (
        <div className="product-gallery">
            <div className="main-image product-emoji">{currentImage}</div>
            <div className="thumbnails">
                {images.map((image) => (
                    <Thumbnail
                        key={image.id}
                        image={image}
                        isActive={currentImage === image.src}
                        onClick={onImageClick}
                    />
                ))}
            </div>
        </div>
    );
}

function ProductHeader({ title, price, rating }) {
    return (
        <>
            <h1>{title}</h1>
            <p className="price">{price}</p>
            <div className="rating">{rating}</div>
        </>
    );
}

function QuantitySelector({ quantity, onQuantityChange }) {
    return (
        <div className="quantity-selector">
            <label htmlFor="quantity">Количество:</label>
            <input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={onQuantityChange}
                className="quantity-input"
            />
        </div>
    );
}

function AddToCartButton({ inCart, onAddToCart }) {
    return (
        <button
            className={`add-to-cart-btn ${inCart ? 'added' : ''}`}
            onClick={onAddToCart}
            disabled={inCart}
        >
            {inCart ? '✓ Добавлено в корзину!' : 'Добавить в корзину'}
        </button>
    );
}

function ProductDescription({ description }) {
    return (
        <div className="product-description">
            <h3>Описание товара</h3>
            <p>{description}</p>
        </div>
    );
}

function ProductInfo({ quantity, onQuantityChange, onAddToCart, inCart }) {
    return (
        <div className="product-info">
            <ProductHeader
                title="Название товара"
                price="5000 ₽"
                rating="★★★★☆ (4.2)"
            />
            <QuantitySelector
                quantity={quantity}
                onQuantityChange={onQuantityChange}
            />
            <AddToCartButton
                inCart={inCart}
                onAddToCart={onAddToCart}
            />
            <ProductDescription
                description="Высококачественный товар с отличными характеристиками. Идеально подходит для повседневного использования. Гарантия качества и быстрая доставка."
            />
        </div>
    );
}

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
            <Gallery
                currentImage={currentImage}
                onImageClick={handleImageClick}
                images={images}
            />
            <ProductInfo
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                inCart={inCart}
            />
        </div>
    );
}

export default App;
