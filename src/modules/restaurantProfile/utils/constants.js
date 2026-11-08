import { media } from '@m/core/utils/media';
export const links = [
    {
        to: '/restaurantProfile/settings',
        icon: media.icons["settings"],
        text: 'Información básica'
    },
    {
        to: '/restaurantProfile/menu',
        icon: media.icons["credits"],
        text: 'Menú'
    },
    {
        to: '/restaurantProfile/orders',
        icon: media.icons["orders"],
        text: 'Pedidos'
    },
    {
        to: '/restaurantProfile/horarios',
        icon: media.icons["clock"],
        text: 'Horarios'
    },
    {
        to: '/info',
        icon: media.icons["help"],
        text: 'Centro de ayuda'
    }
]