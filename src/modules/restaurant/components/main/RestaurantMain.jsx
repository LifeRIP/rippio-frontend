import { AppImage } from '@m/core/components/appImage/AppImage';
import './RestaurantMain.css'

export function RestaurantMain({ categories, restaurant, selectProduct, setModalProductOpen, setRestaurantOfProduct}) {
    return (
        <section className='RestaurantPage-content-main'>
            <section className='RestaurantPage-content-main-content'>
                {categories
                    ?
                    categories.map((category) => {
                        return (
                            <article className='RestaurantPage-content-main-content-article' key={category.id || category.nombre}>
                                <h3 className='RestaurantPage-content-main-content-articleTitle'>{category.nombre}</h3>
                                {
                                    category.productos
                                        ?
                                        category.productos.map((product) => {
                                            return (
                                                <section key={product.id}>
                                                    <button className='RestaurantPage-content-main-content-articleCard'
                                                        onClick={
                                                            () => {
                                                                const newProduct = { ...product, observation: null }
                                                                selectProduct(newProduct)
                                                                setModalProductOpen(true)
                                                                setRestaurantOfProduct(restaurant)
                                                            }
                                                        }
                                                    >
                                                        <AppImage kind="product" name={product.nombre} category={category.nombre} draggable='false' src={product.img_product} alt={product.nombre} />
                                                        <div>
                                                            <h4>{product.nombre}</h4>
                                                            <p>{product.descripcion}</p>
                                                            <span>$ {product.costo_unit}</span>
                                                        </div>
                                                    </button>
                                                </section>
                                            )
                                        })
                                        : null
                                }
                            </article>
                        )
                    })
                    : <h1>Loading...</h1>
                }
            </section>
        </section>
    )
}
