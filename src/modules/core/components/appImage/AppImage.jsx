/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    Settings, MapPin, CreditCard, CircleDollarSign, Clock3, ClipboardList,
    CircleHelp, Plus, Minus, ShoppingCart, UserRound, Search, Send, Pencil,
    ChevronUp, ChevronDown, LoaderCircle, Star, Menu, LockKeyhole,
    ShoppingBasket, Banknote, ShieldCheck, Bike, Frown, ImagePlus, Crown,
} from 'lucide-react';
import { fallbackImage, resolveImageSource } from '@m/core/utils/media';
import './appImage.css';

const icons = {
    settings: Settings, location: MapPin, payment: CreditCard, credits: CircleDollarSign,
    clock: Clock3, orders: ClipboardList, help: CircleHelp, plus: Plus, minus: Minus,
    cart: ShoppingCart, 'cart-full': ShoppingCart, user: UserRound, search: Search,
    send: Send, edit: Pencil, 'chevron-up': ChevronUp, 'chevron-down': ChevronDown,
    loader: LoaderCircle, star: Star, menu: Menu, lock: LockKeyhole,
    'empty-cart': ShoppingBasket, salary: Banknote, shield: ShieldCheck,
    courier: Bike, sad: Frown, image: ImagePlus, crown: Crown,
};

// Last resort is embedded so even a missing local replacement cannot retry forever.
const emergencyImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="24" fill="#e1f2ef"/><path d="M45 50v35m12-35v35m12-35v35M57 85v35m45-70c-15 0-15 38 0 38v32m0-70v38" fill="none" stroke="#11928d" stroke-width="7" stroke-linecap="round"/></svg>');

function Photo({ source, fallback, reference, alt, kind, onError, ...props }) {
    const [attempt, setAttempt] = useState(0);
    const current = attempt === 0 ? source : attempt === 1 ? fallback : emergencyImage;
    return <img {...props} src={current} alt={alt} data-image-kind={kind}
        data-reference-image={reference || attempt > 0 ? 'true' : undefined}
        onError={event => {
            onError?.(event);
            if (attempt < 2) setAttempt(attempt === 0 && source !== fallback ? 1 : 2);
        }} />;
}

export function AppImage({ src, kind = 'product', name, category, alt, className = '', loading, decoding, onError, ...props }) {
    if (typeof src === 'string' && src.startsWith('icon:')) {
        const iconName = src.slice(5);
        const Icon = icons[iconName] || ImagePlus;
        return <Icon {...props} className={`app-icon ${className}`} data-icon={iconName}
            strokeWidth={2} role={alt ? 'img' : undefined} aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true} focusable="false" />;
    }
    const fallback = fallbackImage(kind, name, category);
    const source = resolveImageSource(src, fallback);
    return <Photo key={`${source}|${fallback}`} {...props} className={className}
        loading={loading} decoding={decoding} onError={onError}
        source={source} fallback={fallback} reference={source !== src}
        kind={kind} alt={alt ?? (name ? String(name) : '')} />;
}
