import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
import { isChatConfigured } from '@m/core/apollo-client';
/* eslint-disable react/prop-types */
import LeftMessage from '@m/core/components/leftMessage/LeftMessage';
import RightMessage from '@m/core/components/rightMessage/RightMessage';
import './chatModal.css';
import Modal from 'react-modal'
import { useEffect } from 'react';
import { useChatMutation, useChatQuery, useChatSubscription } from '../../hooks/custom-hooks';
import { useAuth } from "@m/core/hooks/useAuth";

function ConfiguredChatModal({ isOpen, closeModal, order }) {
    const user = useAuth((state) => state.user);
    const { data, loading, error: queryError } = useChatQuery(order.id)
    const { handleSendMessage, handleChange, message, error: sendError, sending } = useChatMutation(order.id);
    const { error: subscriptionError } = useChatSubscription(order.id);

    // Llevar el scroll del ChatModal-body al final
    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            const chatModalBody = document.querySelector('.ChatModal-body');
            if (!chatModalBody) return;
            chatModalBody.scrollTop = chatModalBody.scrollHeight;
        }, 0);
        return () => clearTimeout(timer);
    }, [data, isOpen]);

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className='ChatModal Modal'
            >
                <header className='ChatModal-header'>
                    <AppImage kind="restaurant" name={order.nombre || order.name} className='ChatModal-header_image' src={order.img_icon} alt='Chat' />
                    {
                        user.tipo_usuario == 1 ?
                            <h3>{order.nombre}</h3>
                            : <h3>{order.cliente}</h3>
                    }
                    <button className='ChatModal-header_button' onClick={closeModal}>X</button>
                </header>
                <section className='ChatModal-body'>
                    {
                        user.tipo_usuario == 1 ?
                            <p className='ChatModal-body_initial'>Aquí empieza tu conversación con {order.nombre}</p>
                            : <p className='ChatModal-body_initial'>Aquí empieza tu conversación con {order.cliente}</p>
                    }

                    {loading && <p>Cargando mensajes ⌛</p>}
                    {(queryError || sendError || subscriptionError) && (
                        <p role='alert'>{sendError || queryError?.message || subscriptionError?.message}</p>
                    )}

                    {user.tipo_usuario == 3 && data && data.getchat_order.map((data, index) =>
                    (data.tipo_usuario == 3 ?
                        <RightMessage key={index} message={data.mensaje} date={data.fecha} image={data.img_icon} /> :
                        <LeftMessage key={index} message={data.mensaje} date={data.fecha} image={data.img_icon} />))}

                    {user.tipo_usuario == 1 && data && data.getchat_order.map((data, index) =>
                    (data.tipo_usuario == 1 ?
                        <RightMessage key={index} message={data.mensaje} date={data.fecha} image={data.img_icon} /> :
                        <LeftMessage key={index} message={data.mensaje} date={data.fecha} image={data.img_icon} />))}

                </section>
                <footer className='ChatModal-footer'>
                    {(order.estado != "Cancelado" && order.estado != "Entregado") ?
                        <form
                            onSubmit={handleSendMessage}
                        >
                            <input className='ChatModal-footer_input' type='text' placeholder='Escribe un mensaje...'
                                onChange={handleChange} value={message} disabled={sending}
                            />
                            <button className='ChatModal-footer_button' disabled={sending || !message.trim()}>
                                <AppImage className='ChatModal-footer_button_image' src={media.icons["send"]} alt='Enviar' />
                            </button>
                        </form>
                        : <p className='ChatModal-footer_message'>La conversación ha finalizado. El estado de la orden es {order.estado}</p>
                    }
                </footer>
            </Modal>
        </div>
    )
}
export default function ChatModal(props) {
    if (!props.isOpen || !props.order) return null;
    if (isChatConfigured) return <ConfiguredChatModal {...props} />;
    return (
        <Modal isOpen={props.isOpen} onRequestClose={props.closeModal} className='ChatModal Modal'>
            <header className='ChatModal-header'>
                <h3>Chat no disponible</h3>
                <button onClick={props.closeModal} aria-label='Cerrar chat'>X</button>
            </header>
            <section className='ChatModal-body'>
                <p>El servicio de mensajes todavía no está configurado.</p>
            </section>
        </Modal>
    );
}
