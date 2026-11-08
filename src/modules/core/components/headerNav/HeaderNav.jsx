import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import './headerNav.css'
import HeaderDrawer from '@m/core/components/headerDrawer/HeaderDrawer'
import { useCart } from '@m/core/hooks/useCart'
import { Link, useMatch } from 'react-router-dom'
import { handleClickCartModal } from '@m/core/utils/cart'
import { useAuth } from '@m/core/hooks/useAuth'

export default function HeaderNav() {
    const cart = useCart((state) => state.cart)
    const { toggleCartModal } = useCart()
    const isAuthenticated = useAuth((state) => state.isAuthenticated)
    const user = useAuth((state) => state.user)

    return (
        <header className='mainContent-headerPrincipalPage'>
            <div className='mainContent-headerPrincipalPage-logo'>
                <Link to='/'><AppImage kind="logo" alt="Rippio Food" className='logoIcon' draggable='false' src={media.logo} /></Link>
            </div>
            <nav className='headerPrincipalPage-nav'>
                <ul className='headerPrincipalPage-ul'>
                    <li className='headerPrincipalPage-ul-li'>
                        <Link className={useMatch('/') ? 'headerPrincipalPage-a active' : 'headerPrincipalPage-a'} to='/'>Principal</Link>
                    </li>
                    <li className='headerPrincipalPage-ul-li'>
                        <Link className={useMatch('/allrestaurants') ? 'headerPrincipalPage-a active' : 'headerPrincipalPage-a'} to='/allrestaurants'>Restaurantes</Link>
                    </li>
                    <li className='headerPrincipalPage-ul-li'>
                        <Link className={useMatch('/info') ? 'headerPrincipalPage-a active' : 'headerPrincipalPage-a'} to='/info'>Información</Link>
                    </li>
                </ul>
            </nav>
            <section className='headerPrincipalPage-userSection'>
                {
                    !isAuthenticated || user?.tipo_usuario === 1
                        ?
                        <div>
                            <button aria-label="Abrir carrito" onClick={() => handleClickCartModal(toggleCartModal)} className='cartLink'>
                                {
                                    cart.items.length > 0 ?
                                        <AppImage className='cartIcon' src={media.icons["cart-full"]} />
                                        :
                                        <AppImage className='cartIcon' src={media.icons["cart"]} />
                                }
                            </button>
                        </div>
                        : null
                }
                <div>
                    {
                        <Link aria-label={isAuthenticated ? 'Mi perfil' : 'Ingresar'} to={isAuthenticated ? '/profile' : '/login'}
                            className='headerPrincipalPage-a'>
                            <div className='userlink'>
                                <AppImage kind={user?.tipo_usuario === 3 ? "restaurant" : "avatar"} name={user?.nombre} className='userIcon'
                                    src={isAuthenticated ? user?.img_icon : media.icons["user"]}
                                />
                                <span className='userText'>{isAuthenticated ? user.tipo_usuario !== 3 ? user.nombre.split(' ')[0] : user.nombre : 'Ingresa'}
                                </span></div></Link>

                    }
                </div>
                <HeaderDrawer />
            </section>
        </header>
    )
}
