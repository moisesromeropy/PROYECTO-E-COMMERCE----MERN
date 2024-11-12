import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaPhoneAlt } from "react-icons/fa";
import googleIcon from '../../assets/images/googleIcon.png';
import { IoMdHome } from "react-icons/io";
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

// I. Definición del componente SignUp
const SignUp = () => {
    // II. Definición de estados
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formfields, setFormfields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isAdmin: true
    });

    const history = useNavigate();
    const context = useContext(MyContext);

    // III. Efecto para ocultar el sidebar y el header
    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, []);

    // IV. Función para manejar el enfoque en los campos de entrada
    const focusInput = (index) => {
        setInputIndex(index);
    };

    // V. Función para manejar el cambio en los campos de entrada
    const onchangeInput = (e) => {
        setFormfields(() => ({
            ...formfields,
            [e.target.name]: e.target.value
        }));
    };

    // VI. Función para manejar el envío del formulario de registro
    const signUp = (e) => {
        e.preventDefault();
        try {
            // Validaciones de los campos del formulario
            if (formfields.name === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "El nombre no puede estar en blanco."
                });
                return false;
            }
            if (formfields.email === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "El correo no puede estar en blanco."
                });
                return false;
            }
            if (formfields.phone === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "El teléfono no puede estar en blanco."
                });
                return false;
            }
            if (formfields.password === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "La contraseña no puede estar en blanco."
                });
                return false;
            }
            if (formfields.confirmPassword === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Confirmar contraseña no puede estar en blanco."
                });
                return false;
            }
            if (formfields.confirmPassword !== formfields.password) {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Las contraseñas no coinciden."
                });
                return false;
            }

            setIsLoading(true);

            // Envío de datos al servidor
            postData("/api/user/signup", formfields).then((res) => {
                console.log(res);
                if (res.error !== true) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "¡Registrado exitosamente!"
                    });

                    setTimeout(() => {
                        setIsLoading(true);
                        history("/login");
                    }, 2000);
                } else {
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            }).catch(error => {
                setIsLoading(false);
                console.error('Error al enviar los datos:', error);
            });
        } catch (error) {
            console.log(error);
        }
    };

    // VII. Renderización del componente
    return (
        <>
            <section className="loginSection signUpSection">
                <div className='row'>
                    <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1>ADMIN 
                            <span className='text-sky'> E-COMMERCE MERN</span>
                        </h1>
                        <p>CODING DOJO, 2024</p>
                        <div className='w-100 mt-4'>
                            <Link to={'/'}> <Button className="btn-blue btn-lg btn-big"><IoMdHome /> Ir a Inicio</Button></Link>
                        </div>
                    </div>
                    <div className='col-md-4 pr-0'>
                        <div className="loginBox">
                            <div className='logo text-center'>
                                <img src={Logo} width="60px" alt="Logo" />
                                <h5 className='font-weight-bold'>Registrarse con una nueva cuenta</h5>
                            </div>
                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={signUp}>
                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle /></span>
                                        <input 
                                            type='text' 
                                            className='form-control' 
                                            placeholder='Ingrese su nombre' 
                                            onFocus={() => focusInput(0)} 
                                            onBlur={() => setInputIndex(null)} 
                                            autoFocus 
                                            name="name" 
                                            onChange={onchangeInput} 
                                        />
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input 
                                            type='text' 
                                            className='form-control' 
                                            placeholder='Ingrese su e-mail' 
                                            onFocus={() => focusInput(1)} 
                                            onBlur={() => setInputIndex(null)} 
                                            name="email" 
                                            onChange={onchangeInput} 
                                        />
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><FaPhoneAlt /></span>
                                        <input 
                                            type='text' 
                                            className='form-control' 
                                            placeholder='Ingrese su número de teléfono móvil' 
                                            onFocus={() => focusInput(2)} 
                                            onBlur={() => setInputIndex(null)} 
                                            name="phone" 
                                            onChange={onchangeInput} 
                                        />
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input 
                                            type={`${isShowPassword === true ? 'text' : 'password'}`} 
                                            className='form-control' 
                                            placeholder='Ingrese su contraseña' 
                                            onFocus={() => focusInput(3)} 
                                            onBlur={() => setInputIndex(null)} 
                                            name="password" 
                                            onChange={onchangeInput} 
                                        />
                                        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }
                                        </span>
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmarkSharp /></span>
                                        <input 
                                            type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} 
                                            className='form-control' 
                                            placeholder='Confirme su contraseña' 
                                            onFocus={() => focusInput(4)} 
                                            onBlur={() => setInputIndex(null)} 
                                            name="confirmPassword" 
                                            onChange={onchangeInput} 
                                        />
                                        <span className='toggleShowPassword' onClick={() => setisShowConfirmPassword(!isShowConfirmPassword)}>
                                            {
                                                isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }
                                        </span>
                                    </div>
                                    <FormControlLabel control={<Checkbox />} label="Estoy de acuerdo con todos los términos y condiciones" />
                                    <div className='form-group'>
                                        <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                            {
                                                isLoading === true ? <CircularProgress /> : 'Registrarse'
                                            }
                                        </Button>
                                    </div>
                                    <div className='form-group text-center mb-0'>
                                        <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                            <span className='line'></span>
                                            <span className='txt'>o</span>
                                            <span className='line'></span>
                                        </div>
                                        <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                            <img src={googleIcon} width="25px" alt="Google Icon" /> &nbsp; Entrar con Google
                                        </Button>
                                    </div>
                                </form>
                                <span className='text-center d-block mt-3'>
                                    No tienes una cuenta:
                                    <Link to={'/login'} className='link color ml-1'>Inicio Sesión</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

// VIII. Exportar componente
export default SignUp;
