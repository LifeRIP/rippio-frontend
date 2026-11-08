import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './rankingRestaurantSlider.css';
import { Link } from 'react-router-dom';

export function RankingRestaurantSlider({ slides }) {

    return (

        <section className="bestNearRestaurant secondSection-child">
            <h2 className='bestNearRestaurant-title'>Los mejores restaurantes cerca de ti</h2>
            
            <div className='bestNearRestaurant-slider-container'>
                <Swiper
                    spaceBetween={40}
                    navigation={true}
                    // loop={false}
                    // autoplay={
                    //     {
                    //         delay: 1000,
                    //     }
                    // }
                    breakpoints={
                        {
                            0: {
                                slidesPerView: 1,
                            },
                            200: {
                                slidesPerView: 2,
                            },
                            350: {
                                slidesPerView: 4,

                            },
                            550: {
                                slidesPerView: 6,

                            },
                            800: {
                                slidesPerView: 7,

                            },
                            1100: {
                                slidesPerView: 8,
                            },
                        }
                    }
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={slide.id}>
                            <Link className='top-restaurant-btn-img' to={`/restaurant/${slide.id}`}>
                                {index === 0 && <AppImage src={media.crown} alt="Gold Frame" className="top-reward" />}
                                {index === 0 && <AppImage src={media.medals.gold} alt="Gold Frame" className="award-frame" />}
                                {index === 1 && <AppImage src={media.medals.silver} alt="Silver Frame" className="award-frame" />}
                                {index === 2 && <AppImage src={media.medals.bronze} alt="Bronze Frame" className="award-frame" />}
                                <AppImage kind="restaurant" name={slide.nombre || slide.name} className='restaurant-img' src={slide.img_icon} alt={slide.id} />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </section>


    );
}