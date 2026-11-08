import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { useState } from 'react';
import './ProfileIcon.css'
import { uploadFile } from "@m/core/utils/image";
import axios from 'axios';
import { useAuth } from "@m/core/hooks/useAuth";

export function ProfileIcon() {

    const [loading, setLoading] = useState(false)
    const user = useAuth((state) => state.user)
    const setUser = useAuth((state) => state.setUser)
    const token = useAuth((state) => state.token)

    const handleInputProfileChange = async (e) => {
        setLoading(true);
        const userType = user.tipo_usuario === 3 ? 'RestaurantIcon' : user.tipo_usuario === 1 ? 'UserIcon' : 'AdminIcon';
        try {
            const newImage = await uploadFile(e.target.files[0], userType, user.id);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/profile/modify_profile_image`,
                {
                    image: newImage
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            setUser({ ...user, img_icon: newImage });
        } catch (error) {
            console.error(error);
        }
        e.target.value = null;
        setLoading(false);
    }

    const handleButtonClick = () => {
        const upload = document.getElementById('upload');
        upload.click();
    }

    return (
        <div className="ProfileIconOptionsContainer-uploadIconContainer">
            <AppImage kind={user?.tipo_usuario === 3 ? "restaurant" : "avatar"} name={user?.nombre}
                className={loading ? "ProfileIconOptions-header-imgProfile loading" : "ProfileIconOptions-header-imgProfile"}
                id="ProfileIcon-imgProfile"
                draggable='false'
                src={loading ? media.icons["loader"] : user.img_icon}
                alt="Foto de perfil"
            />
            <label className="hidden-label" htmlFor="upload">Subir imagen:</label>
            <input type="file" id="upload" name="upload" accept=".png, .jpg, .jpeg"
                onChange={handleInputProfileChange} />
            <button className="ProfileIconOptions-header-button" onClick={handleButtonClick}>
                <AppImage draggable='false' className="ProfileIconOptions-header-imgEdit" src={media.icons.edit} alt="Upload Icon" />
            </button>
        </div>
    )
}