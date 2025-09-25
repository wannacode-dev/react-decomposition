import './style.css';
const { useState } = React;

function Gallery({ currentImage, onImageClick, images }) {
    return (
        <div className="product-gallery">
            <img 
                src={currentImage} 
                alt="Product" 
                className="main-image"
            />
            <div className="thumbnails">
                {images.map(image => (
                    <img 
                        key={image.id}
                        src={image.src} 
                        alt={image.alt}
                        className={`thumbnail ${currentImage === image.src ? 'active' : ''}`}
                        onClick={() => onImageClick(image.src)}
                    />
                ))}
            </div>
        </div>
    );
}

function ProductInfo({ quantity, onQuantityChange, onAddToCart, inCart }) {
    return (
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
                    onChange={onQuantityChange}
                    className="quantity-input"
                />
            </div>

            <button 
                className={`add-to-cart-btn ${inCart ? 'added' : ''}`}
                onClick={onAddToCart}
                disabled={inCart}
            >
                {inCart ? '✓ Добавлено в корзину!' : 'Добавить в корзину'}
            </button>
            
            <div className="product-description">
                <h3>Описание товара</h3>
                <p>Высококачественный товар с отличными характеристиками. Идеально подходит для повседневного использования. Гарантия качества и быстрая доставка.</p>
            </div>
        </div>
    );
}

function App() {
    const [currentImage, setCurrentImage] = useState('product.jpeg');
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const images = [
        { id: 1, src: 'product.jpeg', alt: 'Основное изображение' },
        { id: 2, src: 'thumb1.jpeg', alt: 'Изображение 1' },
        { id: 3, src: 'thumb2.jpeg', alt: 'Изображение 2' }
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


