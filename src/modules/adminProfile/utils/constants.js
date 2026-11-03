import { media } from '@m/core/utils/media';
export const links = [
    {
        to: '/adminProfile/restaurantManagement',
        icon: media.icons["settings"],
        text: 'Gestor de negocios'
    },
    {
        to: '/adminProfile/graphs',
        icon: media.icons["settings"],
        text: 'Gráficas'
    }
]

export const  formatDateYMDH_TO_DMY = (date) => {
    const DMY = date.split('T')[0].split('-').reverse().join('-');
    return DMY;
}