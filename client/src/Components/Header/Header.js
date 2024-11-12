// I. Importaciones necesarias
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import Button from '@mui/material/Button';
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from './SearchBox/SearchBox';
import Navigation from './Navigation/Navigation';
import { MyContext } from '../../MyContext/MyContext';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FaClipboardCheck, FaHeart, FaUserAlt } from "react-icons/fa";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import NoUserImg from '../../assets/images/no-user.jpg';

// II. Definición del Componente Header
const Header = () => {
    // III. Definición de Estados
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenNav, setIsOpenNav] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const open = Boolean(anchorEl);

    const headerRef = useRef();
    const context = useContext(MyContext);

    // IV. Funciones de Manejo de Eventos
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        setAnchorEl(null);
        localStorage.clear();
        context.setIsLogin(false);
        context.setUser(null);
        window.location.href = "/signIn";
    };

    // V. Efectos
    useEffect(() => {
        window.addEventListener("scroll", () => {
            let position = window.pageYOffset;
            if (headerRef.current) {
                if (position > 100) {
                    headerRef.current.classList.add('fixed');
                } else {
                    headerRef.current.classList.remove('fixed');
                }
            }
        });
    }, []);

    // VI. Funciones de Manejo de Navegación y Búsqueda
    const openNav = () => {
        setIsOpenNav(!isOpenNav);
        context.setIsOpenNav(true);
    };

    const closeNav = () => {
        setIsOpenNav(false);
        context.setIsOpenNav(false);
    };

    const openSearch = () => {
        setIsOpenSearch(!isOpenSearch);
    };

    const closeSearch = () => {
        setIsOpenSearch(false);
    };

    // VII. Renderización del Componente
    return (
        <>
            <div className='headerWrapperFixed' ref={headerRef}>
                <div className="headerWrapper">
                    <div className="top-strip bg-blue">
                        <div className="container">
                            <p className="mb-0 mt-0 text-center">Hoy es un gran día para darte un gusto</p>
                        </div>
                    </div>

                    <header className="header">
                        <div className="container">
                            <div className="row">
                                <div className="logoWrapper d-flex align-items-center col-sm-2">
                                    <Link to={'/'}><img src={Logo} alt='Logo' /></Link>
                                </div>

                                <div className='col-sm-10 d-flex align-items-center part2'>
                                    <div className={`headerSearchWrapper ${isOpenSearch === true && 'open'}`}>
                                        <div className='d-flex align-items-center'>
                                            <span className="closeSearch mr-3" onClick={() => setIsOpenSearch(false)}><FaAngleLeft /></span>
                                            <SearchBox closeSearch={closeSearch} />
                                        </div>
                                    </div>

                                    <div className='part3 d-flex align-items-center ml-auto'>
                                        {context.windowWidth < 992 && <Button className="circle ml-3 toggleNav" onClick={openSearch}><IoIosSearch /></Button>}

                                        {context.isLogin ? (
                                            <>
                                                <Button className='circle mr-3' onClick={handleClick}>
                                                    <Avatar src={context.user?.profileImage || NoUserImg} alt="Profile" />
                                                </Button>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    id="accDrop"
                                                    open={open}
                                                    onClose={handleClose}
                                                    onClick={handleClose}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                >
                                                    <Link to="/my-account">
                                                        <MenuItem onClick={handleClose}>
                                                            <ListItemIcon>
                                                                <FaUserAlt fontSize="small" />
                                                            </ListItemIcon>
                                                            Mi perfil
                                                        </MenuItem>
                                                    </Link>
                                                    <Link to="/orders">
                                                        <MenuItem onClick={handleClose}>
                                                            <ListItemIcon>
                                                                <FaClipboardCheck fontSize="small" />
                                                            </ListItemIcon>
                                                            Órdenes
                                                        </MenuItem>
                                                    </Link>
                                                    <Link to="/my-list">
                                                        <MenuItem onClick={handleClose}>
                                                            <ListItemIcon>
                                                                <FaHeart fontSize="small" />
                                                            </ListItemIcon>
                                                            Mi lista de favoritos
                                                        </MenuItem>
                                                    </Link>
                                                    <MenuItem onClick={logout}>
                                                        <ListItemIcon>
                                                            <RiLogoutCircleRFill fontSize="small" />
                                                        </ListItemIcon>
                                                        Cerrar Sesión
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        ) : (
                                            <Link to="/signIn"><Button className="btn-blue btn-round mr-3">Iniciar Sesión</Button></Link>
                                        )}

                                        <div className='ml-auto cartTab d-flex align-items-center'>
                                            {context.windowWidth > 1000 && (
                                                <span className='price'>
                                                    {(context.cartData?.length !== 0 ?
                                                        context.cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)
                                                        ?.toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })}
                                                </span>
                                            )}

                                            <div className='position-relative ml-2'>
                                                <Link to="/cart">
                                                    <Button className='circle'><IoBagOutline /></Button>
                                                    <span className='count d-flex align-items-center justify-content-center'>{context.cartData?.length}</span>
                                                </Link>
                                            </div>

                                            {context.windowWidth < 992 && <Button className="circle ml-3 toggleNav" onClick={openNav}><IoMdMenu /></Button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {context.categoryData?.length !== 0 && <Navigation navData={context.categoryData} isOpenNav={isOpenNav} closeNav={closeNav} />}
                </div>
            </div>
        </>
    );
};

// VIII. Exportación del Componente
export default Header;
