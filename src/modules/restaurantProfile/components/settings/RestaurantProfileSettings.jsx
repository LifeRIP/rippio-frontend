import { useRef } from 'react';
import './RestaurantProfileSettings.css'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Select from 'react-select'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@m/core/hooks/useAuth';
import { getCategories } from '@/api/restaurant'
import { editProfileRestaurant } from '@/api/user'



const vias = [
    { value: '1', label: 'Calle' },
    { value: '2', label: 'Carrera' },
    { value: '3', label: 'Diagonal' },
    { value: '4', label: 'Transversal' },
    { value: '5', label: 'Circular' },
    { value: '6', label: 'Avenida' },
];

const customStyles = {
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
    control: base => ({
        ...base,
        height: '3.5em',
        minHeight: '3.5em',
    }),
};

export function RestaurantProfileSettings() {
    const primaryTooltipRef = useRef(null);
    const secondaryTooltipRef = useRef(null);


    const [departamentos, setDepartamentos] = useState([])
    const [ciudades, setCiudades] = useState([])
    const [categories, setCategories] = useState([])

    const [message, setMessage] = useState(null)

    const [loading, setLoading] = useState(false)

    const token = useAuth((state) => state.token)
    const user = useAuth((state) => state.user)


    useEffect(() => {
        getCategories()
            .then(response => {
                const newCategories = response.data.map(category => ({ value: category.id, label: category.nombre }));
                setCategories(newCategories);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    const handleDepartamentoChange = (selectedOption) => {
        const newCiudades = selectedOption.ciudades.map((ciudad, index) => ({ value: index, label: ciudad }));
        setCiudades(newCiudades);
    }

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json')
            .then(response => {
                const newDepartamentos = response.data.map(departamento => ({ value: departamento.id, label: departamento.departamento, ciudades: departamento.ciudades }));
                setDepartamentos(newDepartamentos);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    // TODO: IMPLEMENTAR PARA RESTAURANTES
    const [infoDraft, setInfoDraft] = useState(null);
    const info = infoDraft || {
        categories: {
            main: categories.find(category => category.value === user.id_categoria?.[0]) || '',
            secondary: categories.find(category => category.value === user.id_categoria?.[1]) || '',
        },
        phone: user.telefono,
        address: {
            departamento: user.departamento ? { value: user.departamento, label: user.departamento } : '',
            ciudad: user.ciudad ? { value: user.ciudad, label: user.ciudad } : '',
            barrio: user.barrio || '',
            tipoVia: user.tipo_via ? { value: user.tipo_via, label: user.tipo_via } : '',
            numAddress: user.numero_via || '', firstNumAddress: user.numero_uno || '', secondNumAddress: user.numero_dos || '',
        },
    };


    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log(info);
        setLoading(true)
        const newInfo = {
            ...info,
            address: { ...info.address, ciudad: info.address.ciudad.label, departamento: info.address.departamento.label, tipoVia: info.address.tipoVia.label },
            categories: { main: info.categories.main.value, secondary: info.categories.secondary.value }
        }
        editProfileRestaurant(token, newInfo.address, newInfo.phone, newInfo.categories)
            .then(response => {
                console.log(response.data);
                setMessage('Cambios guardados correctamente')
                setLoading(false)
            })
            .catch(error => {
                console.log(error);
                setMessage('Error al guardar los cambios')
                setLoading(false)
            });
    }

    // UseEffect para quitar el mensaje de error o de éxito después de 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => { setMessage(null); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message])


    return (
        <section className='ProfileRestaurantSettings'>
            <h1 className="ProfileRestaurantSettings-h1">Información de tu restaurante</h1>
            <p className="ProfileRestaurantSettings-h2">Administra la información de tu restaurante que verán los usuarios en la página</p>
            <form
                onSubmit={handleSubmitForm}
                className="ProfileRestaurantSettings-form">
                <fieldset className='fieldsetInformation'>
                    <legend className="ProfileRestaurantSettings-Legend">Información general</legend>
                    <div className='ProfileRestaurantSettings-GridForm-nameRestaurant-Div'>
                        <label className="hidden-label" htmlFor="nameRestaurant">Nombre del restaurante</label>
                        <input ref={primaryTooltipRef} className='block-input ProfileRestaurantSettings-Input' readOnly type="text" id="nameRestaurant" name="nameRestaurant"
                                placeholder={user.nombre} />
                        <Tippy content='Para cambiar el nombre de tu restaurante, por favor ponte en contacto con el soporte' reference={primaryTooltipRef} />
                    </div>
                    <div className='ProfileRestaurantSettings-GridForm-nameRestaurant-Div'>
                        <label className="hidden-label" htmlFor="nameRestaurant">Nombre del restaurante</label>
                        <input ref={secondaryTooltipRef} className='block-input ProfileRestaurantSettings-Input' readOnly type="text" id="emailRestaurant" name="emailRestaurant"
                                placeholder={user.email} />
                        <Tippy content='Para cambiar el correo de tu restaurante, por favor ponte en contacto con el soporte' reference={secondaryTooltipRef} />
                    </div>
                    <div className='ProfileRestaurantSettings-GridForm-Category-Div'>
                        <label className="hidden-label" htmlFor="category">Categoría principal</label>
                        <Select
                            value={info.categories.main}
                            onChange={
                                (selectedOption) => {
                                    if (selectedOption != info.categories.secondary) {
                                        const newInfo = { ...info, categories: { ...info.categories, main: selectedOption } }
                                        setInfoDraft(newInfo)
                                    } else {
                                        alert('La categoría principal no puede ser igual a la secundaria')
                                    }
                                }
                            }
                            className='ProfileRestaurantSettings-GridForm-Category-Div-select' styles={customStyles} options={categories} placeholder='Categoría principal' />
                    </div>
                    <div className='ProfileRestaurantSettings-GridForm-Category-Div'>
                        <label className="hidden-label" htmlFor="category">Categoría secundaria</label>
                        <Select
                            value={info.categories.secondary}
                            onChange={
                                (selectedOption) => {
                                    if (selectedOption != info.categories.main) {
                                        const newInfo = { ...info, categories: { ...info.categories, secondary: selectedOption } }
                                        setInfoDraft(newInfo)
                                    } else {
                                        alert('La categoría secundaria no puede ser igual a la principal')
                                    }
                                }
                            }
                            className='ProfileRestaurantSettings-GridForm-Category-Div-select' styles={customStyles} options={categories} placeholder='Categoría secundaria' />
                    </div>
                    <div className='ProfileRestaurantSettings-GridForm-telPrefix-Div'>
                        <label className="hidden-label" htmlFor="telPrefix">Prefijo</label>
                        <input className='block-input ProfileRestaurantSettings-Input' readOnly type="text" id="telPrefix" name="telPrefix"
                            placeholder='+57' />
                    </div>
                    <div className='ProfileRestaurantSettings-GridForm-telNumber-Div'>
                        <label className="hidden-label" htmlFor="telNumber">Número de teléfono</label>
                        <input
                            className='ProfileRestaurantSettings-Input' type="number" id="telNumber" name="telNumber" required
                            value={info.phone}
                            onChange={(e) => {
                                if (e.target.value.length >= 10) e.target.value = e.target.value.slice(0, 10)
                                const newInfo = { ...info, phone: e.target.value }
                                setInfoDraft(newInfo)
                            }}
                            placeholder='Número de teléfono' />
                    </div>
                </fieldset>
                <fieldset className='fieldsetAddress'>
                    <legend className="ProfileRestaurantSettings-Legend">Dirección</legend>
                    <div>
                        <label className="label" htmlFor="address">Departamento</label>
                        <Select className='select'
                            value={info.address.departamento}
                            onChange={
                                (selectedOption) => {
                                    handleDepartamentoChange(selectedOption)
                                    const newInfo = { ...info, address: { ...info.address, departamento: selectedOption } }
                                    setInfoDraft(newInfo)
                                }
                            }
                            styles={customStyles} options={departamentos} placeholder='Seleccionar' />
                    </div>
                    <div>
                        <label className="label" htmlFor="address">Ciudad</label>
                        <Select
                            value={info.address.ciudad}
                            className='select' onChange={
                                (selectedOption) => {
                                    const newInfo = { ...info, address: { ...info.address, ciudad: selectedOption } }
                                    setInfoDraft(newInfo)
                                }}
                            styles={customStyles} options={ciudades} placeholder='Seleccionar' />
                    </div>
                    <div>
                        <label className="label" htmlFor="address">Barrio</label>
                        <input
                            value={info.address.barrio}
                            onChange={
                                (e) => {
                                    const newInfo = { ...info, address: { ...info.address, barrio: e.target.value } }
                                    setInfoDraft(newInfo)
                                }}
                            className='ProfileRestaurantSettings-Input' type="text" id="address" name="address" required
                            placeholder='Barrio' />
                    </div>
                    <div>
                        <label className="label" htmlFor="tipoVia">Tipo de vía</label>
                        <Select
                            value={info.address.tipoVia}
                            onChange={
                                (selectedOption) => {
                                    const newInfo = { ...info, address: { ...info.address, tipoVia: selectedOption } }
                                    setInfoDraft(newInfo)
                                }}
                            className='select' styles={customStyles} options={vias} placeholder='Seleccionar' />
                    </div>
                    <div className='fieldsetAddress-address-div'>
                        <label className="label" htmlFor="address">Dirección</label>
                        <div>
                            <input
                                value={info.address.numAddress}
                                className='ProfileRestaurantSettings-Input' required type="text" id="numAddress" name="numAddress" maxLength='3'
                                onChange={(e) => {
                                    const newInfo = { ...info, address: { ...info.address, numAddress: e.target.value } }
                                    setInfoDraft(newInfo)
                                }}
                            />
                            #
                            <input className='ProfileRestaurantSettings-Input' required type="text" id="firstNumAddress" name="firstNumAddress" maxLength='3'
                                value={info.address.firstNumAddress}
                                onChange={
                                    (e) => {
                                        if (e.target.value.length >= 3) e.target.value = e.target.value.slice(0, 3)
                                        const newInfo = { ...info, address: { ...info.address, firstNumAddress: e.target.value } }
                                        setInfoDraft(newInfo)
                                    }
                                }
                            />
                            -
                            <input className='ProfileRestaurantSettings-Input' required type="text" id="secondNumAddress" name="secondNumAddress" maxLength='3'
                                value={info.address.secondNumAddress}
                                onChange={
                                    (e) => {
                                        if (e.target.value.length >= 3) e.target.value = e.target.value.slice(0, 3)
                                        const newInfo = { ...info, address: { ...info.address, secondNumAddress: e.target.value } }
                                        setInfoDraft(newInfo)
                                    }}
                            />
                        </div>
                    </div>
                </fieldset>
                <button className='ProfileRestaurantSettings-Button' type="submit">
                    {
                        loading
                            ? 'Guardando...'
                            : 'Guardar cambios'
                    }
                </button>
                    {
                        message && <p style={
                            {color: message.includes('Error') ? 'red' : 'green'}
                        }>{message}</p>
                    }
            </form>
        </section>
    )
}