import { AppImage } from '@m/core/components/appImage/AppImage';
import highlight from '/principalPage/highlight/highlight01.png';
import './highlight.css'

export function Highlight(){
    return (
        <section className="Highlight firstSection-child">
        <div className="Highlight-imgContainer">
            <AppImage draggable='false' src={highlight} alt="Highlight" />
        </div>
    </section>
    )
}