// I. Importaciones necesarias
// Importamos React y algunos hooks de su biblioteca
import React, { useContext, useEffect, useState } from 'react';
// Importamos Link y useNavigate de react-router-dom para la navegación
import { Link, useNavigate } from "react-router-dom";
// Importamos el logo de nuestra aplicación
import logo from '../../assets/images/logo.png';
// Importamos componentes de Material-UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
// Importamos íconos de diferentes bibliotecas
import { MdMenuOpen, MdOutlineMenu, MdOutlineLightMode, MdNightlightRound, MdDarkMode, MdOutlineMailOutline } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import { IoShieldHalfSharp } from "react-icons/io5";
// Importamos componentes personalizados y contexto
import { MyContext } from '../../App';
import UserAvatarImgComponent from '../userAvatarImg/userAvatarImg';
import SearchBox from "../SearchBox";
// Importamos íconos de Material-UI
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';

// II. Definición del componente Header
const Header = () => {

    // III. Definición de los estados
    // Manejo del estado para el menú de cuenta del usuario
    const [anchorEl, setAnchorEl] = useState(null);
    // Manejo del estado para el menú de notificaciones
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
    // Determina si el menú de cuenta del usuario está abierto
    const openMyAcc = Boolean(anchorEl);
    // Determina si el menú de notificaciones está abierto
    const openNotifications = Boolean(isOpennotificationDrop);

    // IV. Uso del contexto
    // Obtenemos el contexto de la aplicación
    const context = useContext(MyContext);

    // V. Definición del historial de navegación
    // Obtenemos el hook de navegación
    const history = useNavigate();

    // VI. Funciones de manejo de menús y temas

    // Abre el menú de cuenta del usuario
    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Cierra el menú de cuenta del usuario
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    // Abre el menú de notificaciones
    const handleOpenotificationsDrop = () => {
        setisOpennotificationDrop(true);
    };

    // Cierra el menú de notificaciones
    const handleClosenotificationsDrop = () => {
        setisOpennotificationDrop(false);
    };

    // Cambia el tema de la aplicación
    const changeTheme = () => {
        if (context.theme === "dark") {
            context.setTheme("light");
        } else {
            context.setTheme("dark");
        }
    };

    // Manejo del cierre de sesión
    const logout = () => {
        localStorage.clear();
        setAnchorEl(null);
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout successful"
        });

        // Redirige al usuario a la página de login después de 2 segundos
        setTimeout(() => {
            history("/login");
        }, 2000);
    };

    // VII. Renderizado del componente
    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">

                        {/* VIII. Sección del logo */}
                        <div className="col-sm-2 part1 pr-0">
                            <Link to={'/'} className="d-flex justify-content-center logo">
                                <img src={logo} alt="logo" />
                            </Link>
                        </div>

                        {/* IX. Sección del botón del menú y la barra de búsqueda */}
                        <div className="col-sm-3 d-flex align-items-center part2">
                            <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                {
                                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                            </Button>
                            <SearchBox />
                        </div>

                        {/* X. Sección de botones de acciones y menús desplegables */}
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            {/* Botón para cambiar el tema */}
                            <Button className="rounded-circle mr-3" onClick={changeTheme}>
                                {
                                    context.theme === "light" ? <MdNightlightRound /> : <MdOutlineLightMode />
                                }
                            </Button>
                            <Button className="rounded-circle mr-3"><IoCartOutline /></Button>
                            <Button className="rounded-circle mr-3"><MdOutlineMailOutline /></Button>

                            {/* XI. Menú de notificaciones */}
                            <div className='dropdownWrapper position-relative'>
                                <Button className="rounded-circle mr-3" onClick={handleOpenotificationsDrop}><FaRegBell /></Button>

                                <Menu
                                    anchorEl={isOpennotificationDrop}
                                    className='notifications dropdown_list'
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleClosenotificationsDrop}
                                    onClick={handleClosenotificationsDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className='head pl-3 pb-0'>
                                        <h4>Órdenes (12)</h4>
                                    </div>
                                    <Divider className="mb-1" />
                                    <div className='scroll'>
                                        {/* XII. Lista de notificaciones */}
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <div className='d-flex'>
                                                <div>
                                                    <UserAvatarImgComponent img={'https://mironcoder-hotash.netlify.app/images/avatar/01.webp'} />
                                                </div>
                                                <div className='dropdownInfo'>
                                                    <h4>
                                                        <span>
                                                            <b>IPHONE 14</b>
                                                            Añadido a su lista de favoritos
                                                            <b> SMARTPHONE IPHONE...</b>
                                                        </span>
                                                    </h4>
                                                    <p className='text-sky mb-0'>hace unos segundos</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        {/* Más elementos de notificaciones... */}
                                    </div>
                                    <div className='pl-3 pr-3 w-100 pt-2 pb-1'>
                                        <Button className='btn-blue w-100'>Ver todas las notificaciones</Button>
                                    </div>
                                </Menu>
                            </div>

                            {/* XIII. Menú de cuenta del usuario */}
                            {
                                context.isLogin !== true ?
                                    <Link to={'/login'}><Button className='btn-blue btn-lg btn-round'>Iniciar Sesión</Button></Link>
                                    :
                                    <div className="myAccWrapper">
                                        <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                                            <div className="userImg">
                                                <span className="rounded-circle">
                                                    {context.user?.name?.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="userInfo">
                                                <h4>{context.user?.name}</h4>
                                                <p className="mb-0">{context.user?.email}</p>
                                            </div>
                                        </Button>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMyAcc}
                                            onClose={handleCloseMyAccDrop}
                                            onClick={handleCloseMyAccDrop}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <PersonAdd fontSize="small" />
                                                </ListItemIcon>
                                                Mi Cuenta
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <IoShieldHalfSharp />
                                                </ListItemIcon>
                                                Restablecer Contraseña
                                            </MenuItem>
                                            <MenuItem onClick={logout}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Cerrar Sesión
                                            </MenuItem>
                                        </Menu>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

// XIV. Exportacion del componente
export default Header;
