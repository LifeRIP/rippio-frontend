import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
/* eslint-disable react/prop-types */
import './headerSearch.css'

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '@m/core/hooks/useCart'

import { handleClickCartModal } from '../../utils/cart'
import  HeaderDrawer  from '@m/core/components/headerDrawer/HeaderDrawer';
import { useAuth } from '@m/core/hooks/useAuth';

export default function HeaderSearch({ isCheckout = false }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const cart = useCart((state) => state.cart)
    const { toggleCartModal } = useCart()

    const user = useAuth((state) => state.user);
    const isAuthenticated = useAuth((state) => state.isAuthenticated);


    return (
        <header className='header'>
            <AppImage kind="logo" draggable='false' onClick={() => { navigate(`/`) }} alt='logo_rippio' className='header-img' src={media.logo} />
            <form onSubmit={(e) => {
                e.preventDefault;
                search.trim() && navigate(`/searchpage/${search}`);
            }} className='header-form'>
                <input onChange={(e) => { setSearch(e.target.value) }} className='header-form-text' type='text' placeholder='¡Encuentra tus restaurantes favoritos!' />
                <button aria-label='Buscar' className='header-form-btn' type='submit'>
                    <AppImage className='header-form-btn-img' src={media.icons["search"]} />
                </button>
            </form>
            <nav className='header-nav'>
                <ul className='header-ul'>
                    <li className='header-li'>
                        {
                            !isCheckout &&
                            <button
                                onClick={() => handleClickCartModal(toggleCartModal)}
                                className='header-li-link'>
                                {
                                    cart.items.length > 0 ?
                                        <AppImage draggable='false' alt='cart' className='header-li-img' src={media.icons["cart-full"]} />
                                        :
                                        <AppImage draggable='false' alt='cart' className='header-li-img' src={media.icons["cart"]} />
                                }
                            </button>
                        }
                    </li>
                    <li className='header-li'>
                        <Link className='header-li-link' to='/login'>
                            <div className='header-li-div'>
                                {
                                    isAuthenticated ?
                                        <>
                                            <AppImage kind={user?.tipo_usuario === 3 ? "restaurant" : "avatar"} name={user?.nombre} draggable='false' alt='User' className='header-li-img header-li-img-userIcon' src={user.img_icon} />
                                            <span className='header-li-span'>{user.nombre}</span>
                                        </>
                                        :
                                        <>
                                            <AppImage draggable='false' alt='User' className='header-li-img header-li-img-userIcon' src={media.icons["user"]} />
                                            <span className='header-li-span'>Ingresa</span>
                                        </>
                                }
                            </div>
                        </Link>
                    </li>
                    <HeaderDrawer />
                </ul>
            </nav>
        </header>
    )
}