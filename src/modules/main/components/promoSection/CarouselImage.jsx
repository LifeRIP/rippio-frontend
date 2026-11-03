import { AppImage } from '@m/core/components/appImage/AppImage';
/* eslint-disable react/prop-types */
import { register } from 'swiper/element/bundle';
import './carouselImage.css';
// register Swiper custom elements
register();


export function CarouselImage({ slides }) {
    return (
        <section className="Carousel firstSection-child">
            <swiper-container
                slides-per-view="1"
                navigation="true"
                pagination="true"
                loop='true'
                autoplay='true'
                speed='1000'
            >
                {slides.map((slide) => (
                    <swiper-slide key={slide.image}>
                        <div className="carousel-promotion">
                            <AppImage src={slide.image} alt={slide.title} />
                            <div className="carousel-promotion-copy">
                                <span>Descubre nuevos sabores</span>
                                <h3>{slide.title}</h3>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    </swiper-slide>
                ))}
            </swiper-container>
        </section>
    );
}

