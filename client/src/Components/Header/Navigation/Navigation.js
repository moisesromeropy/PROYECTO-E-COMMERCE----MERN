// I: Importación de dependencias y componentes
import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../../MyContext/MyContext';

//  II: Definición y estado inicial del componente Navigation
const Navigation = (props) => {
    const [isopenSidebarVal, setisopenSidebarVal] = useState(false); // Estado para el menú lateral
    const [isOpenNav, setIsOpenNav] = useState(false); // Estado para la navegación abierta o cerrada
    
    const context = useContext(MyContext); // Contexto para manejar el estado global de la aplicación

    // Efecto para sincronizar el estado de navegación con las propiedades recibidas
    useEffect(() => {
        setIsOpenNav(props.isOpenNav);
    }, [props.isOpenNav]);

    // Lista de categorías de navegación
    const categories = [
        { name: 'INICIO', path: '/'},
        { name: 'SOBRE NOSOTROS', path: '/about-us' },
        { name: 'CONTACTANOS', path: '/contact-us' }
        
    ];

    // Función para alternar el estado del menú lateral
    const handleSidebarToggle = () => {
        setisopenSidebarVal(!isopenSidebarVal);
    };

    //  III: Renderizado del componente Navigation
    return (
        <nav>
            <div className='container'>
                <div className='row'>
                    {/* <div className='col-sm-2 navPart1'>
                        <div className='catWrapper'>
                            <Button className='allCatTab align-items-center res-hide' onClick={handleSidebarToggle}>
                                <span className='icon1 mr-2'><IoIosMenu /></span>
                                <span className="text">Categorías</span>
                                <span className='icon2 ml-2'><FaAngleDown /></span>
                            </Button>
                        </div>
                    </div> */}
                    {!isopenSidebarVal && (
                        <div className={`col-sm-9 navPart2 d-flex align-items-center ${isOpenNav ? 'open' : 'close'}`}>
                            <ul className={`list list-inline ml-auto res-nav ${isOpenNav ? 'hidden-nav' : ''}`}>
                                {categories.map((item, index) => (
                                    <li className='list-inline-item' key={index} onClick={props.closeNav}>
                                        <Link to={item.path}>
                                            <Button>{item.name}</Button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {isopenSidebarVal && (
                        <div className={`sidebarNav open`}>
                            <ul>
                                {categories.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.path}>
                                            <Button>{item.name} <FaAngleRight className='ml-auto' /></Button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

//  IV: Exportación del componente Navigation
export default Navigation;
