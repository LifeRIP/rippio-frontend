import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
/* eslint-disable react/prop-types */
import './searchSection.css'
import locationIcon from '/principalPage/icons/locationIcon.png';
import searchIcon from '/principalPage/icons/searchIcon.png';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function SearchSection({location}) {

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <section className='SearchSection MainContent-bodySection-search'>
            <section className="firstSearchSection">
                <header className="location">
                    <AppImage draggable='false' className='locationImg' src={locationIcon} alt="location"></AppImage>
                    <p>
                        {
                            location ?
                                `${location.city}, ${location.principalSubdivision}`
                                :
                                'No pudimos obtener tu ubicación'
                        }
                    </p>
                </header>
                <section className='searchFormSection'>
                    <div className='searchFormInfo'>
                        <h2 className='searchFormTitle'>¿Qué te apetece comer hoy?</h2>
                        <p className='searchFormP'>Descubre restaurantes que están cerca de ti</p>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        searchTerm.trim() && navigate(`/searchpage/${searchTerm}`)
                    }} className='Form-container'>
                        <input
                            className='FormSearchText'
                            type="text"
                            autoComplete='off'
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        <button className='FormSearchBtn'>
                            <AppImage src={searchIcon} alt="searchIcon"></AppImage>
                        </button>
                    </form>
                </section>
            </section>
            <section className="secondSearchSection">
                <AppImage draggable='false'  className='secondSearchSection-img' src={media.hero[0]} alt="foodIcon"></AppImage>
                <AppImage draggable='false' className='secondSearchSection-img' src={media.hero[1]} alt="foodIcon"></AppImage>
                <AppImage draggable='false' className='secondSearchSection-img' src={media.hero[2]} alt="foodIcon"></AppImage>
                <AppImage draggable='false' className='secondSearchSection-img' src={media.hero[3]} alt="foodIcon"></AppImage>
                <AppImage draggable='false' className='secondSearchSection-img' src={media.heroBackground} alt="foodIcon"></AppImage>
            </section>
        </section>
    )
}