import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import HeaderNav from '@m/core/components/headerNav/HeaderNav';
import { Footer } from '@m/core/components/footer/Footer';
import { useEffect } from 'react';
import './teamPage.css'


export function TeamPage() {


    useEffect(() => {
        window.scrollTo(0,0)
    },[])

    return (
        <div className='team-background-container'>
            <HeaderNav />
            <div className='team-container'>
                <div className='team-container-title'>
                    <h1>La Familia Rippio</h1>
                    <h2>Un lugar que protege tu seguridad, derechos laborales y tiene las mejores tarifas del mercado actual</h2>
                    <p>¡Felicidades! ya llegaste aquí.</p>
                    <AppImage src={media.icons.courier}/>
                </div>
                <div className='team-container-subtitle'>
                    <h2>Algunos de los beneficios que podrás obtener si te unes al Team Rippio</h2>
                    <p>Todos los beneficios están supuestos a cambios y siguen las regulaciones requeridas por las directrices del país. </p>
                </div>
                <div className='team-container-grid'>
                    <div>
                        <AppImage src={media.icons.salary} />
                        <h3>Salario competitivo</h3>
                        <p>Obtén un salario competitivo que te permita vivir cómodamente y disfrutar de la vida. En Rippio Food, valoramos tu esfuerzo 
                            y dedicación, por lo que ofrecemos una remuneración justa y atractiva, acorde con el mercado.</p>
                    </div>
                    <div>
                        <AppImage src={media.icons.shield} />
                        <h3>Seguro de salud</h3>
                        <p>Al cumplir cierto periodo de prueba, obtendrás un seguro de salud que te proteja contra posibles accidentes o asaltos. 
                            Tu bienestar es nuestra prioridad, y queremos asegurarnos de que estés cubierto ante cualquier eventualidad. 
                            </p>
                    </div>
                    <div>
                        <AppImage src={media.icons.clock} />
                        <h3>Horario flexible</h3>
                        <p>Trabaja en tus propios términos y horarios. En Rippio Food, entendemos que cada persona tiene diferentes necesidades 
                            y responsabilidades. Por eso, ofrecemos la flexibilidad de elegir tus horarios de trabajo.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}