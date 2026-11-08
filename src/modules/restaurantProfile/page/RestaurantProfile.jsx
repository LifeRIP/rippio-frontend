import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { Footer } from "@m/core/components/footer/Footer";
import HeaderNav from "@m/core/components/headerNav/HeaderNav";
import { Outlet } from 'react-router-dom';

import './restaurantProfile.css'
import { ProfilePanel } from "@m/core/components/ProfilePanel/ProfilePanel";
import { uploadFile } from "@m/core/utils/image";
import { useState } from "react";
import { useAuth } from "@m/core/hooks/useAuth";
import axios from "axios";
import { ProfileIcon } from "@m/core/components/profileIcon/ProfileIcon";
import { links } from "../utils/constants";
import FalseStateMessage from "../components/falseStateMessage/FalseStateMessage";




export function RestaurantProfile() {

    const user = useAuth((state) => state.user)
    const setUser = useAuth((state) => state.setUser)
    const token = useAuth((state) => state.token)
    const isAuthenticated = useAuth((state) => state.isAuthenticated)
    const logout = useAuth((state) => state.logout)

    const [loading, setLoading] = useState(false)

    const handleInputProfileBannerChange = async (e) => {
        setLoading(true);
        try {
            const newImage = await uploadFile(e.target.files[0], 'RestaurantBanner', user.id);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/profile/modify_banner_restaurant`,
                {
                    image: newImage
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            setUser({ ...user, img_banner: newImage });
        } catch (error) {
            console.error(error);
        }
        e.target.value = null;
        setLoading(false);
    }

    const handleButtonBannerClick = () => {
        const upload = document.getElementById('uploadBanner');
        upload.click();
    }

    return (
        <main className="ProfileRestaurantPage">
            <HeaderNav />
            {user.estado === false && <FalseStateMessage />}
            {isAuthenticated &&
                <section className="ProfileRestaurantPageContent">
                    <section className="ProfileRestaurantOptionsContainer">
                        <header className="ProfileRestaurantOptions-header">

                            <div className="ProfileRestaurantOptionsContainer-uploadBannerContainer">
                                <AppImage kind="banner" name={user.nombre}
                                    className={loading ? "ProfileRestaurantOptions-header-banner loading" : "ProfileRestaurantOptions-header-banner"}
                                    id="ProfileRestauran-imgProfile"
                                    draggable='false'
                                    src={loading ? media.icons["loader"] : user.img_banner}
                                    alt="banner"
                                />
                                <label className="hidden-label" htmlFor="upload">Subir imagen:</label>
                                <input type="file" id="uploadBanner" name="uploadBanner" accept=".png, .jpg, .jpeg"
                                    onChange={handleInputProfileBannerChange} />
                                <button className="ProfileRestaurantOptions-header-button" onClick={handleButtonBannerClick}>
                                    <AppImage draggable='false' className="ProfileRestaurantOptions-header-imgEditBanner" src={media.icons.edit} alt="Upload Icon" />
                                </button>
                            </div>

                            <div className="ProfileRestaurantOptions-header-titleAndIcon">
                                <ProfileIcon />
                                <div>
                                    <h1 className="RestaurantProfileTitle">{user.nombre}</h1>
                                </div>
                            </div>
                        </header>
                        <ProfilePanel links={links} />
                        <button onClick={logout} className="ProfileOptions-logout">Cerrar sesión</button>
                    </section>
                    <section className="ProfileRestaurantChildrenPage">
                        <Outlet />
                    </section>
                </section>
            }

            <Footer />
        </main>
    )
}