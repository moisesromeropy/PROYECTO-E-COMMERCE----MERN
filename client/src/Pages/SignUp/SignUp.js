// I. Importaciones necesarias
import React, { useState, useContext } from 'react'; // Importaciones de React y hooks
import { TextField, Button, CircularProgress } from '@mui/material'; // Importaciones de Material-UI
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto
import { Link, useNavigate } from 'react-router-dom'; // Importaciones de React Router
import { postData } from '../../utils/api'; // Importación de la función postData
import Logo from '../../assets/images/logo.png'; // Importación del logo
import GoogleImg from '../../assets/images/googleImg.png'; // Importación de la imagen de Google

// II. Definición del componente SignUp
const SignUp = () => {
    // II.a Definición de estados
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    }); // Estado para los campos del formulario
    const context = useContext(MyContext); // Uso del contexto MyContext
    const navigate = useNavigate(); // Hook de navegación de React Router

    // III. Manejar cambios en los inputs
    const onChangeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    // IV. Manejar el registro
    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Datos enviados:', formFields); // Añadir para verificar los datos enviados
            const res = await postData('/api/user/signup', formFields);
            if (!res.error) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Registro exitoso'
                });
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/signIn');
                }, 2000);
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.error
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: error.message
            });
            setIsLoading(false);
        }
    };

    // V. Renderizado del componente
    return (
        <section className="section signInPage signUpPage">
            <div className="shape-bottom">
                <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" style={{ enableBackground: 'new 0 0 1921 819.8' }}>
                    <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                </svg>
            </div>

            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center mb-4">
                        <img src={Logo} style={{ width: '100px' }} alt="Logo" />
                    </div>

                    <form className="mt-2" onSubmit={register}>
                        <h2 className="mb-3">Registrarse</h2>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <TextField id="name" label="Nombre" name="name" onChange={onChangeInput} type="text" variant="standard" className="w-100" required />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <TextField id="phone" label="Teléfono" name="phone" onChange={onChangeInput} type="text" variant="standard" className="w-100" required />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <TextField id="email" label="Email" type="email" name="email" onChange={onChangeInput} variant="standard" className="w-100" required />
                        </div>

                        <div className="form-group">
                            <TextField id="password" label="Contraseña" name="password" onChange={onChangeInput} type="password" variant="standard" className="w-100" required />
                        </div>

                        <div className="d-flex align-items-center mt-3 mb-3">
                            <div className="row w-100">
                                <div className="col-md-6">
                                    <Button type="submit" disabled={isLoading} className="btn-blue w-100 btn-lg btn-big">
                                        {isLoading ? <CircularProgress /> : 'Registrarse'}
                                    </Button>
                                </div>

                                <div className="col-md-6 pr-0">
                                    <Link to="/" className="d-block w-100">
                                        <Button className="btn-lg btn-big w-100" variant="outlined" onClick={() => context.setisHeaderFooterShow(true)}>Cancelar</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Button className="loginWithGoogle mt-2" variant="outlined">
                            <img src={GoogleImg} alt="Google" /> Registrarse con Google
                        </Button>

                        <p className="text-center mt-4">
                            ¿Ya tienes una cuenta? <Link to="/signIn" className="border-effect">Iniciar sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

// VI. Exportación del componente SignUp
export default SignUp;
