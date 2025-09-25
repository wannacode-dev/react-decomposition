import '../../styles.css';
const { useState } = React;

function App() {
    const [products] = useState([
        { id: 1, name: 'Ноутбук', category: 'Электроника', price: 50000, inStock: true },
        { id: 2, name: 'Футболка', category: 'Одежда', price: 1500, inStock: false }
    ]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Все');
    const [inStockOnly, setInStockOnly] = useState(false);

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === 'Все' || product.category === category) &&
            (!inStockOnly || product.inStock);
    });

    return (
        <div className="product-filter">
            <div className="filters">
                <input 
                    type="text" 
                    placeholder="Поиск товаров..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Все">Все категории</option>
                    <option value="Электроника">Электроника</option>
                    <option value="Одежда">Одежда</option>
                </select>
                <label>
                    <input 
                        type="checkbox" 
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    Только в наличии
                </label>
            </div>
            
            <div className="product-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-item">
                        <h3>{product.name}</h3>
                        <p>Категория: {product.category}</p>
                        <p>Цена: {product.price} ₽</p>
                        <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                            {product.inStock ? 'В наличии' : 'Нет в наличии'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


