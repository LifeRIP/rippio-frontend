import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import './planSection.css'
import { getPlans } from '@/api/plan'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BuyPlanModal } from '@m/core/modals/buyPlanModal/BuyPlanModal'

export function PlanSection({pay_method, getPlan}) {

    //Estado para almacenar los planes
    const [plans, setPlans] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //UseEffect para traer los planes
    useEffect(() => {
        getPlans()
            .then(res => {
                // res.data.descripcion es un string con los features separados por coma
                res.data.forEach(plan => {
                    plan.descripcion = plan.descripcion.split(',');
                });
                //Ahora res.data es un array de objetos con los features separados
                setPlans(res.data);
            }).catch(err => {
                console.log(err);
            })
    }, [])

    //Función para abrir modal de plan
    const handlePlanModal = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    }

    return (
        <section className='planSection'>
            <div className='plan-background'>
                <AppImage draggable='false' className='plan-background-img' src={media.waves}></AppImage>
            </div>
            <section className='businessSection-plans-content'>
                {
                    !plans ? <p>Cargando...</p> :
                    plans.map((plan) => {
                        return (
                            <section key={plan.id} className='businessSection-plan-item'>
                                <header className='plan-header'>
                                    <div className='plan-icon-container'>
                                        <AppImage kind="illustration" className='planIcon' draggable='false'
                                        src={
                                            plan.id === 1 ? media.plans.basic
                                            : plan.id === 2 ? media.plans.plus
                                            : media.plans.premium
                                        }
                                        />
                                        <p className='iconText'>Rippio {plan.nombre}</p>
                                    </div>
                                    <h2 className='plan-title'>{plan.nombre}</h2>
                                    <p className='planPrice'>{plan.precio} COP al mes</p>
                                </header>
                                <ul className='plan-ul'>
                                    {   plan.descripcion &&
                                        plan.descripcion.map((feature) => {
                                            return (
                                                <li key={feature}
                                                className='plan-ul-li'>{feature}</li>
                                            )
                                        })
                                    }
                                </ul>
                                <button onClick={() => handlePlanModal(plan)} className='planBtn' href='#'>Conseguir plan</button>
                                <Link to='/info' className='terminosBtn' href='#'>Términos y condiciones</Link>
                            </section>
                        )
                    })
                }
            </section>
            <BuyPlanModal plan={selectedPlan} isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)} pay_method={pay_method}
            getPlan={getPlan}/>
        </section>
    )
}