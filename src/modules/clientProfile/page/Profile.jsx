import { media } from '@m/core/utils/media';
import { Footer } from "@m/core/components/footer/Footer";
import HeaderSearch from "@m/core/components/headerSearch/HeaderSearch";
import { Outlet } from 'react-router-dom';

import './profile.css'

import { useAuth } from "@m/core/hooks/useAuth";
import { ProfilePanel } from "@m/core/components/ProfilePanel/ProfilePanel";
import { ProfileIcon } from "@m/core/components/profileIcon/ProfileIcon";
import { useCart } from "@m/core/hooks/useCart";


const links = [
    {
        to: '/profile/settings',
        icon: media.icons["settings"],
        text: 'Ajustes de cuenta'
    },
    {
        to: '/profile/directions',
        icon: media.icons["location"],
        text: 'Direcciones'
    },
    {
        to: '/profile/paymentmethods',
        icon: media.icons["payment"],
        text: 'Métodos de pago'
    },
    {
        to: '/profile/credits',
        icon: media.icons["credits"],
        text: 'Créditos'
    },
    {
        to: '/profile/orders',
        icon: media.icons["clock"],
        text: 'Últimos pedidos'
    }
]



export function Profile() {

    const user = useAuth((state) => state.user)
    const isAuthenticated = useAuth((state) => state.isAuthenticated)
    const logout = useAuth((state) => state.logout)

    const { loadCartFromLocalStorage, setTokenInCart } = useCart();

    const handleLogout = () => {
        loadCartFromLocalStorage();
        setTokenInCart(null);
        logout();
    }


    return (
        <main className="ProfilePage">
            <HeaderSearch />
            {
                isAuthenticated
                    ?
                    <section className="ProfilePageContent">

                        <section className="ProfileOptionsContainer">
                            <header className="ProfileOptions-header">

                                <ProfileIcon user={user} />

                                <div>
                                    <p>Mi perfil</p>
                                    <p>{user.nombre}</p>
                                </div>
                            </header>
                            <ProfilePanel links={links} />
                            <button onClick={handleLogout} className="ProfileOptions-logout">Cerrar sesión</button>
                        </section>
                        <section className="ProfileChildrenPage">
                            <Outlet />
                        </section>
                    </section>
                    : null
            }
            <Footer />
        </main>
    )
}