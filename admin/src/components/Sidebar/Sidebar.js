// I. Importaciones necesarias
import Button from '@mui/material/Button';
import { MdDashboard, MdMessage } from "react-icons/md";
import { FaAngleRight, FaProductHunt, FaCartArrowDown, FaBell, FaClipboardCheck } from "react-icons/fa6";
import { IoIosSettings, IoMdLogOut } from "react-icons/io";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../App';

// II. Definición del componente Sidebar
const Sidebar = () => {

    // III. Definición de los estados
    const [activeTab, setActiveTab] = useState(0); // Estado para la pestaña activa
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false); // Estado para el submenú
    const [isLogin, setIsLogin] = useState(false); // Estado para el login

    // IV. Uso del contexto
    const context = useContext(MyContext);

    // V. Definición del historial de navegación
    const history = useNavigate();

    // VI. Funciones de manejo de submenús y logout
    // Abre o cierra el submenú y establece la pestaña activa
    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    };

    // Verifica el estado de login en el montaje del componente
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else {
            history("/login");
        }
    }, []);

    // Manejo del cierre de sesión
    const logout = () => {
        localStorage.clear();
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Sesión cerrada correctamente"
        });
        setTimeout(() => {
            history("/login");
        }, 2000);
    };

    // VII. Renderizado del componente
    return (
        <>
            <div className="sidebar">
                <ul>
                    {/* VIII. Enlace al Dashboard */}
                    <li>
                        <NavLink exact activeClassName='is-active' to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                            </Button>
                        </NavLink>
                    </li>

                    {/* IX. Sección de Productos */}
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><FaProductHunt /></span>
                            Productos
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink exact activeClassName='is-active' to="/products">Lista de Productos</NavLink></li>
                                <li><NavLink exact activeClassName='is-active' to="/product/upload">Subir Producto</NavLink></li>
                                <li><NavLink exact activeClassName='is-active' to="/productRAMS/add">Agregar Producto RAMS</NavLink></li>
                                <li><NavLink exact activeClassName='is-active' to="/productWEIGHT/add">Agregar Producto WEIGHT</NavLink></li>
                                <li><NavLink exact activeClassName='is-active' to="/productSIZE/add">Agregar Producto SIZE</NavLink></li>
                            </ul>
                        </div>
                    </li>

                    {/* X. Sección de Categorías */}
                    <li>
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className='icon'><FaProductHunt /></span>
                            Categorías
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/category">Lista de Categorías</Link></li>
                                <li><Link to="/category/add">Agregar Categoría</Link></li>
                                <li><Link to="/subCategory">Lista de Subcategorías</Link></li>
                                <li><Link to="/subCategory/add">Agregar Subcategoría</Link></li>
                            </ul>
                        </div>
                    </li>

                    {/* XI. Enlace a Órdenes */}
                    <li>
                        <NavLink exact activeClassName='is-active' to="/orders">
                            <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className='icon'> <FaClipboardCheck fontSize="small" /></span>
                                Órdenes
                            </Button>
                        </NavLink>
                    </li>

                    {/* XII. Sección de Diapositivas del Banner de Inicio */}
                    <li>
                        <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                            <span className='icon'><FaProductHunt /></span>
                            Diapositivas del Banner de Inicio
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink exact activeClassName='is-active' to="/homeBannerSlide/add">Agregar Diapositiva</NavLink></li>
                                <li><NavLink exact activeClassName='is-active' to="/homeBannerSlide/list">Lista de Diapositivas</NavLink></li>
                            </ul>
                        </div>
                    </li>

                    {/* XIII. Sección de Mensajes */}
                    <li>
                        <NavLink exact activeClassName='is-active' to="/messages">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                <span className='icon'><MdMessage /></span>
                                Mensajes
                            </Button>
                        </NavLink>
                    </li>

                    {/* XIV. Sección de Configuración */}
                    <li>
                        <NavLink exact activeClassName='is-active' to="/settings">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                <span className='icon'><IoIosSettings /></span>
                                Configuración
                            </Button>
                        </NavLink>
                    </li>
                </ul>

                <br />

                {/* XV. Botón de Cerrar Sesión */}
                <div className='logoutWrapper'>
                        <Button className="btn-blue btn-lg w-100 btn-big" onClick={logout}><IoMdLogOut /> Cerrar Sesión</Button>
                </div>
            </div>
        </>
    );
}

// XVI. Exportación del componente
export default Sidebar;
