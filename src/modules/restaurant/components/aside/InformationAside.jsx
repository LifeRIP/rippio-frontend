import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { useEffect, useState } from 'react';
import './informationAside.css'

export function InformationAside({ name, direction, schedule, rating, logo, banner }) {

    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 700);
    const [showSchedule, setShowSchedule] = useState(true);

    const handleShowSchedule = () => {
        const scheduleElement = document.querySelector('.RestaurantPage-content-aside-information-schedule-days');
        scheduleElement.classList.toggle('RestaurantPage-content-aside-information-schedule-days-active');
        setShowSchedule(!showSchedule);
    }

    useEffect(() => {

        const checkScreenSize = () => {
            setIsScreenSmall(window.innerWidth < 700);
            if (window.innerWidth > 700) {
                setShowSchedule(true);
            } else {
                setShowSchedule(false);
            }
        };
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);



    return (
        <aside className='RestaurantPage-content-aside'>
            {
                isScreenSmall
                    ?
                    <section className='RestaurantPage-content-aside-presentation'>
                        <div className='aside-presentation-bannerAndLogo'>
                            <AppImage kind="banner" name={name} draggable='false' className='aside-presentation-banner' src={banner} alt='Banner'></AppImage>
                            <div>
                                <AppImage kind="restaurant" draggable='false' className='aside-presentation-logo' src={logo} alt='Logo'></AppImage>
                                <h1 className='aside-presentation-name'>{name}</h1>
                            </div>
                        </div>
                    </section>
                    :
                    <section className='RestaurantPage-content-aside-presentation'>
                        <div className='aside-presentation-bannerAndLogo'>
                            <AppImage kind="banner" name={name} draggable='false' className='aside-presentation-banner' src={banner} alt='Banner'></AppImage>
                            <AppImage kind="restaurant" draggable='false' className='aside-presentation-logo' src={logo} alt='Logo'></AppImage>
                        </div>
                        <h1 className='aside-presentation-name'>{name}</h1>
                    </section>
            }
            <section className='RestaurantPage-content-aside-information'>
                <p>{direction}</p>
                <section className='RestaurantPage-content-aside-information-stats'>
                    <div>Delivery <span>10 min</span></div>
                    <div>Envío <span>$3000</span></div>
                    <div>Calificación <span className='RestaurantPage-content-aside-information-stats-rating'>
                    <AppImage src={media.icons["star"]} alt='Star'></AppImage>
                    {rating}</span></div>
                </section>
                <section className='RestaurantPage-content-aside-information-schedule'>
                    <button
                        className='RestaurantPage-content-aside-information-schedule-btn'
                        onClick={handleShowSchedule}
                    >
                        Horarios
                        {
                            isScreenSmall
                                ? showSchedule
                                    ? <AppImage src={media.icons["chevron-up"]} alt='Arrow'></AppImage>
                                    : <AppImage src={media.icons["chevron-down"]} alt='Arrow'></AppImage>
                                : showSchedule
                                    ? <AppImage src={media.icons["chevron-up"]} alt='Arrow'></AppImage>
                                    : <AppImage src={media.icons["chevron-down"]} alt='Arrow'></AppImage>
                        }
                    </button>
                    <div className={
                        isScreenSmall
                            ?
                            'RestaurantPage-content-aside-information-schedule-days'
                            :
                            'RestaurantPage-content-aside-information-schedule-days RestaurantPage-content-aside-information-schedule-days-active'
                    }
                    >
                        {
                            schedule
                                ? schedule.map((day) => {
                                    return (
                                        <div className='RestaurantPage-content-aside-information-schedule-day' key={day.day}>

                                            {
                                                (day.open === '00:00' && day.close === '00:00')
                                                    ? <>
                                                        <span>{day.day}</span>
                                                        <span>Cerrado</span>
                                                    </>
                                                    : <>
                                                        <span>{day.day}</span>
                                                        <span>{day.open} - {day.close}</span>
                                                    </>
                                            }
                                        </div>
                                    )
                                })
                                : null
                        }
                    </div>
                </section>
            </section>
        </aside>
    )
}