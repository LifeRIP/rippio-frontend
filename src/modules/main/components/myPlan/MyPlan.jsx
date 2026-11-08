import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import './myPlan.css'
import { cancelPlan } from '@/api/plan'
import { useState } from 'react'
import { useAuth } from '@m/core/hooks/useAuth'

export function MyPlan({ plan, setPlan}) {

    // Estado para el loading de cancelar plan
    const [loadingCancel, setLoadingCancel] = useState(false)
    // Estado para oprimir el botón de cancelar plan
    const [cancelOnce, setCancelOnce] = useState(false)
    // Token de zustand
    const token = useAuth(state => state.token)

    if (!plan) return null

    // Función para cancelar plan
    const handleCancelPlan = () => {
        if (!token) return
        if (cancelOnce) return
        setCancelOnce(true)
        setLoadingCancel(true)
        cancelPlan(token).then(() => {
            setLoadingCancel(false)
            setPlan(null)
        }).catch(err => {
            console.log(err);
            setLoadingCancel(false)
            setCancelOnce(false)
        })
    }

    return (
        <section className='myPlan'>
            <div className='myPlan-content'>
                <section className='myPlan-info'>
                    <header className='myPlan-info-header'>
                        <h2 className='myPlan-info-title'>Rippio {plan.nombre}</h2>
                        <p>Esperamos que disfrutes de tu plan</p>
                    </header>
                    <section className='myPlan-info-feature'>
                        <p className='myPlan-info-feature-text'>Aprovecha al máximo tu plan con las siguientes características:</p>
                        <ul className='myPlan-info-feature-list'>
                            {
                                plan.descripcion.map((feature) => {
                                    return (
                                        <li key={feature} className='myPlan-info-item'>{feature}</li>
                                    )
                                })
                            }
                        </ul>
                    </section>
                    <footer className='myPlan-info-footer'>
                        <button
                        onClick={handleCancelPlan}
                        className='myPlan-info-button'>
                            {loadingCancel ? 'Cancelando...' : 'Cancelar plan'}
                        </button>
                    </footer>
                </section>

                <div className='myPlan-imgContainer'>
                    <AppImage kind="illustration" className='myPlan-img' draggable='false'
                        src={
                            plan.id_plan === 1 ? media.plans.basic
                                : plan.id_plan === 2 ? media.plans.plus
                                    : media.plans.premium
                        }
                    />
                </div>

            </div>

        </section>

    )
}