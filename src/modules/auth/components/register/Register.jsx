import { media } from '@m/core/utils/media';
import { AppImage } from '@m/core/components/appImage/AppImage';
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

export function Register({ userMode, text, setUserRegister, handleSubmitRegister, errors, handleRegisterClick, handleLoginClick, setUserLogin, handleSubmitLogin }) {
    return (
        <section className={userMode ? "register-login-page-content" : "register-login-page-content register-login-page-content-to-Restaurant"}>
            <section className="loginPage-content">
                <form
                    onSubmit={handleSubmitLogin}
                    className={`loginPage-form ${userMode ? 'user-mode' : 'non-user-mode'}`}>
                    <h2 className="loginPage-form-h2">{text.login.title_login}</h2>
                    <div className={`loginPage-form-input ${userMode ? 'user-mode' : 'non-user-mode'}`}>
                        <AppImage src={media.icons.user} />
                        <input type="text" placeholder="Correo electrónico"
                            onChange={(e) => setUserLogin((user) => ({
                                ...user,
                                email: e.target.value
                            }))}
                        />
                    </div>
                    <div className="loginPage-form-input">
                        <AppImage src={media.icons.lock} />
                        <input type="password" placeholder="Contraseña"
                            onChange={(e) => setUserLogin((user) => ({
                                ...user,
                                password: e.target.value
                            }))} />
                    </div>
                    {
                        errors
                            ? <p className="incorrect">{errors.message}</p>
                            : null
                    }
                    <input
                        type="submit"
                        value={text.login.button_login}
                        className={`loginPage-form-button ${userMode ? 'user-mode' : 'non-user-mode'}`}
                    />
                    <Link to="/changepassword" className="loginPage-form-change"> ¿Olvidaste tu contraseña? </Link>
                    <p className="info">
                        {text.login.title_register}{" "}
                        <a
                            href="#"
                            id="registerPage-button2"
                            className="registerPage-button2"
                            onClick={handleRegisterClick}
                        >
                            {text.login.button_register}
                        </a>
                    </p>
                </form>
            </section>

            <section className="registerPage-content">
                <form action="" className={`registerPage-form ${userMode ? 'user-mode' : 'non-user-mode'}`}
                    onSubmit={handleSubmitRegister}
                >
                    <h2 className="registerPage-form-h2"> {text.register.title_register}</h2>

                    <div className={`registerPage-form-input ${userMode ? 'user-mode' : 'non-user-mode'}`}>
                        <input required type="text" placeholder={userMode ? "Nombre" : "Nombre del restaurante"}
                        id='registerInputFirstName'
                            onChange={(e) => setUserRegister((user) => ({
                                ...user,
                                nombre: e.target.value
                            }))}
                        />
                    </div>

                    {
                        userMode
                            ?
                            <div className="registerPage-form-input">
                                <input required type="text" placeholder="Apellido" id='registerInputLastName'
                                    onChange={(e) => setUserRegister((user) => ({
                                        ...user,
                                        apellido: e.target.value
                                    }))}
                                />
                            </div>
                            : null
                    }

                    <div className="registerPage-form-input">
                        <input required type="text" placeholder={userMode ? "Identificación" : "NIT - Documento"} maxLength={userMode ? 10 : 15} minLength='10'
                        id='registerInputId'
                            onChange={(e) => setUserRegister((user) => ({
                                ...user,
                                identificacion: e.target.value
                            }))}
                        />
                    </div>

                    <div className="registerPage-form-input">
                        <input required type="text" placeholder="Teléfono" id='registerInputTel' maxLength={10} minLength='10'
                            onChange={(e) => setUserRegister((user) => ({
                                ...user,
                                telefono: e.target.value
                            }))}
                        />
                    </div>

                    <div className="registerPage-form-input">
                        <input required type="email" placeholder="Correo electrónico" id='registerInputEmail'
                            onChange={(e) => setUserRegister((user) => ({
                                ...user,
                                email: e.target.value
                            }))}
                        />
                    </div>

                    <div className="registerPage-form-input">
                        <input required type="password" placeholder="Contraseña" id='registerInputPass'
                            onChange={(e) => setUserRegister((user) => ({
                                ...user,
                                password: e.target.value
                            }))}
                        />
                    </div>
                    {
                        errors
                            ? <p className="incorrect">{errors.message}</p>
                            : null
                    }
                    <input
                        type="submit"
                        value={text.register.button_register}
                        className={`registerPage-form-button ${userMode ? 'user-mode' : 'non-user-mode'}`}
                    />
                    <p className="info">
                        {text.register.title_login}{" "}
                        <a
                            href="#"
                            id="loginPage-button2"
                            className="loginPage-button2"
                            onClick={handleLoginClick}
                        >
                            {text.register.button_login}
                        </a>
                    </p>
                </form>
            </section>

            <div className={`panels-content ${userMode ? 'user-mode' : 'non-user-mode'}`}>
                <div className="panel left-panel">
                    <div className="left-panel-content">
                        <h3>{text.register.title_login}</h3>
                        <p>
                            {text.register.p_login}
                        </p>
                        <AppImage className='right-panel-image' src={media.food.dessert}></AppImage>
                        <button
                            id="loginPage-button"
                            className="loginPage-button"
                            onClick={handleLoginClick}
                        >
                            {text.register.button_login}
                        </button>
                    </div>
                </div>

                <div className="panel right-panel">
                    <div className="right-panel-content">
                        <h3>{text.login.title_register}</h3>
                        <p>
                            {text.login.p_register}
                        </p>
                        <AppImage className='right-panel-image' src={media.hero[1]}></AppImage>
                        <button
                            id="registerPage-button"
                            className="registerPage-button"
                            onClick={handleRegisterClick}
                        >
                            {text.login.button_register}
                        </button>

                    </div>
                </div>
            </div>
        </section>
    )
}