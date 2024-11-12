// I. Importaciones necesarias
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from '../../assets/images/logo.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import googleIcon from '../../assets/images/googleIcon.png';
import { postData2 } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
    // II. Definición de estados y contextos
    const [inputIndex, setInputIndex] = useState(null); // Para manejar el foco de los inputs
    const [isShowPassword, setisShowPassword] = useState(false); // Para mostrar u ocultar la contraseña
    const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga
    const [isLogin, setIsLogin] = useState(false); // Para manejar el estado de login
    const navigate = useNavigate(); // Hook de navegación
    const context = useContext(MyContext); // Contexto de la aplicación

    // III. Definición de campos del formulario
    const [formfields, setFormfields] = useState({
        email: "",
        password: "",
        isAdmin: true
    });

    // IV. Efecto para manejar la autenticación y el estado del sidebar y header
    useEffect(() => {
        context.setisHideSidebarAndHeader(true); // Oculta el sidebar y header

        const token = localStorage.getItem("token"); // Obtiene el token del localStorage
        if (token) {
            setIsLogin(true);
            navigate("/"); // Redirige al dashboard si el token está presente
        } else {
            navigate("/login"); // Redirige a la página de login si no hay token
        }
    }, [context, navigate]);

    // V. Funciones para manejar el foco y cambios en los inputs
    const focusInput = (index) => {
        setInputIndex(index);
    };

    const onchangeInput = (e) => {
        setFormfields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // VI. Función para manejar el inicio de sesión
    const signIn = (e) => {
        e.preventDefault();

        if (!formfields.email) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "El correo electrónico no puede estar vacío"
            });
            return;
        }

        if (!formfields.password) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "La contraseña no puede estar vacía"
            });
            return;
        }

        setIsLoading(true); // Activa el estado de carga
        postData2("/api/user/signin", formfields).then((res) => {
            try {
                if (!res.error) {
                    localStorage.setItem("token", res.token); // Guarda el token en el localStorage

                    if (res.user?.isAdmin) {
                        const user = {
                            name: res.user?.name,
                            email: res.user?.email,
                            userId: res.user?.id,
                            isAdmin: res.user?.isAdmin
                        };

                        localStorage.setItem("user", JSON.stringify(user)); // Guarda la información del usuario en el localStorage

                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "Usuario autenticado con éxito"
                        });

                        setTimeout(() => {
                            setIsLoading(false); // Desactiva el estado de carga
                            navigate("/dashboard"); // Redirige al dashboard
                        }, 2000);
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: "No tienes permisos de administrador"
                        });
                        setIsLoading(false);
                    }
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        });
    };

    // VII. Renderizado del componente
    return (
        <section className="loginSection">
            <div className="loginBox">
                <div className='logo text-center'>
                    <img src={Logo} width="60px" alt="Logo" />
                    <h5 className='font-weight-bold'>Iniciar Sesión</h5>
                </div>

                <div className='wrapper mt-3 card border'>
                    <form onSubmit={signIn}>
                        <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                            <span className='icon'><MdEmail /></span>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Ingrese su correo Electrónico'
                                onFocus={() => focusInput(0)}
                                onBlur={() => setInputIndex(null)}
                                autoFocus
                                name="email"
                                onChange={onchangeInput}
                            />
                        </div>

                        <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                            <span className='icon'><RiLockPasswordFill /></span>
                            <input
                                type={isShowPassword ? 'text' : 'password'}
                                className='form-control'
                                placeholder='Ingrese su contraseña'
                                onFocus={() => focusInput(1)}
                                onBlur={() => setInputIndex(null)}
                                name="password"
                                onChange={onchangeInput}
                            />
                            <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </span>
                        </div>

                        <div className='form-group'>
                            <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                {isLoading ? <CircularProgress /> : 'Iniciar Sesión'}
                            </Button>
                        </div>

                        <div className='form-group text-center mb-0'>
                            <Link to={'/forgot-password'} className="link">¿Olvidaste tu contraseña?</Link>
                            <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                <span className='line'></span>
                                <span className='txt'>o</span>
                                <span className='line'></span>
                            </div>
                            <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                <img src={googleIcon} width="25px" alt="Google Icon" /> &nbsp; Iniciar Sesión con Google
                            </Button>
                        </div>
                    </form>
                </div>

                <div className='wrapper mt-3 card border footer p-3'>
                    <span className='text-center'>
                        ¿No tienes una cuenta?
                        <Link to={'/signUp'} className='link color ml-1'>Registrarse</Link>
                    </span>
                </div>
            </div>
        </section>
    );
}
//VIII. Exportacion del componente
export default Login;
