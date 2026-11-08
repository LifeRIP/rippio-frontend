import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { Link } from 'react-router-dom'
import './restaurantsInformationResult.css'
import { useCart } from '@m/core/hooks/useCart'
import { checkProductInCart, handleAddToCart } from '../../../core/utils/cart'


export function RestaurantsInformationResult({ results, selectProduct, setModalProductOpen, setRestaurantOfProduct }) {
    const cart = useCart((state) => state.cart)
    const addToCart = useCart((state) => state.addToCart)
    const removeFromCart = useCart((state) => state.removeFromCart)

    return (
        <section className="searchPage-restaurantInformationResult">
            {results.map((restaurant) => {
                return (
                    <section key={restaurant.id} className='restaurantInformation-item'>
                        <header className='restaurantInformation-item-header'>
                            <Link to={`/restaurant/${restaurant.id}`}>
                                <AppImage kind="restaurant" name={restaurant.nombre || restaurant.name} draggable='false' className='restaurantInformation-item-header-img' src={restaurant.img_icon} alt={restaurant.nombre} />
                            </Link>
                            <h2 className='restaurantInformation-item-header-title'>{restaurant.nombre}</h2>
                            <div className='restaurantInformation-item-calificacion'>
                                <AppImage draggable='false' className='item-calificacion-img' src={media.icons["star"]} alt='star' />
                                <span className='item-calificacion-text'>{restaurant.calificacion}</span>
                            </div>
                        </header>
                        <section className='restaurantInformation-item-products'>
                            {restaurant.productos.map((product) => {
                                const restaurantNombre = restaurant.nombre
                                const restaurantId = restaurant.id
                                const restaurantNomId = { id: restaurantId, nombre: restaurantNombre}
                                return (
                                    <section key={product.id} className='restaurantInformation-item-products-product'>
                                        <button
                                            style={{
                                                backgroundColor: checkProductInCart(cart, product) ? '#1b807c' : '#60c0bd'
                                            }}
                                            onClick={() => {
                                                const newProduct = { ...product, observation: null}
                                                checkProductInCart(cart, product)
                                                    ? removeFromCart({ product })
                                                    : handleAddToCart(addToCart, newProduct, restaurantNomId, 1)
                                            }} className='restaurantInformation-item-products-product-button'>
                                            {checkProductInCart(cart, product)
                                                ? <AppImage draggable='false' className='restaurantInformation-item-products-product-button-img Button-minus' src={media.icons["minus"]} alt='minus' />
                                                : <AppImage draggable='false' className='restaurantInformation-item-products-product-button-img' src={media.icons["plus"]} alt='plus' />}
                                        </button>
                                        <button className='restaurantInformation-item-products-product-buttonContainer' onClick={
                                            () => {
                                                const newProduct = { ...product, observation: null }
                                                selectProduct(newProduct)
                                                setModalProductOpen(true)
                                                setRestaurantOfProduct(restaurantNomId)
                                            }
                                        }>
                                            <AppImage kind="product" name={product.nombre} draggable='false' className='restaurantInformation-item-products-product-img' src={product.img_product} alt={product.nombre} />
                                            <div>
                                                <span>$ {product.costo_unit}</span>
                                                <p>{product.nombre}</p>
                                            </div>
                                        </button>
                                    </section>
                                )
                            })}
                        </section>
                    </section>
                )
            })}
        </section>
    )
}