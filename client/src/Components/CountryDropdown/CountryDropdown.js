// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI
import { FaAngleDown } from "react-icons/fa6"; // Importa el icono FaAngleDown de react-icons
import Dialog from '@mui/material/Dialog'; // Importa el componente Dialog de Material-UI
import { IoIosSearch } from "react-icons/io"; // Importa el icono IoIosSearch de react-icons
import { MdClose } from "react-icons/md"; // Importa el icono MdClose de react-icons
import Slide from '@mui/material/Slide'; // Importa el componente Slide de Material-UI para la transición del Dialog
import { MyContext } from '../../MyContext/MyContext'; // Importa el contexto MyContext desde App

// II. Configuración de la transición para el modal
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// III. Definición del componente CountryDropdown
const CountryDropdown = () => {
    // III.1. Definición de estados locales
    const [isOpenModal, setisOpenModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedTab, setselectedTab] = useState(null); // Estado para controlar la pestaña seleccionada
    const [countryList, setcountryList] = useState([]); // Estado para almacenar la lista de países

    // III.2. Acceso al contexto
    const context = useContext(MyContext); // Obtiene el contexto MyContext

    // III.3. Función para seleccionar un país
    const selectCountry = (index, country) => {
        setselectedTab(index);
        setisOpenModal(false);
        context.setselectedCountry(country); // Actualiza el país seleccionado en el contexto
        localStorage.setItem("location", country); // Guarda el país seleccionado en el localStorage
    }

    // III.4. Efecto para actualizar la lista de países cuando el contexto cambia
    useEffect(() => {
        setcountryList(context.countryList); // Actualiza la lista de países local con la del contexto
    }, [context.countryList]); // Dependencia del efecto: context.countryList

    // III.5. Función para filtrar la lista de países
    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase(); // Convierte el término de búsqueda a minúsculas

        if (keyword !== "") {
            const list = countryList.filter((item) => {
                return item.name.toLowerCase().includes(keyword); // Filtra la lista de países
            });
            setcountryList(list); // Actualiza la lista de países filtrada
        } else {
            setcountryList(context.countryList); // Restaura la lista completa si no hay término de búsqueda
        }
    }

    // IV. Renderización del componente
    return (
        <>
            {/* IV.1. Botón para abrir el modal de selección de país */}
            <Button className='countryDrop' onClick={() => {
                setisOpenModal(true);
                setcountryList(context.countryList); // Actualiza la lista de países local con la del contexto
            }}>
                <div className='info d-flex flex-column'>
                    <span className='label'>Tu localidad</span>
                    <span className='name'>
                        {context.selectedCountry !== "" ? 
                            context.selectedCountry.length > 10 ? 
                                context.selectedCountry?.substr(0, 10) + '...' : 
                                context.selectedCountry : 
                            'Select Location'}
                    </span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

            {/* IV.2. Modal de selección de país */}
            <Dialog open={isOpenModal} onClose={() => setisOpenModal(false)} className='locationModal' TransitionComponent={Transition}>
                <h4 className='mb-0'>Elige tu Ubicación para el envío</h4>
                <p>Ingresa tu localidad para especificar el envío.</p>
                <Button className='close_' onClick={() => setisOpenModal(false)}><MdClose /></Button>

                {/* IV.3. Barra de búsqueda en el modal */}
                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Busca tu localidad...' onChange={filterList} />
                    <Button><IoIosSearch /></Button>
                </div>

                {/* IV.4. Lista de países */}
                <ul className='countryList mt-3'>
                    <li><Button onClick={() => selectCountry(0, "All")}>All</Button></li>
                    {countryList?.length !== 0 && countryList?.map((item, index) => {
                        return (
                            <li key={index}><Button onClick={() => selectCountry(index, item.name)}
                                className={`${selectedTab === index ? 'active' : ''}`}
                            >{item.name}</Button></li>
                        )
                    })}
                </ul>
            </Dialog>
        </>
    )
}

// V. Exportación del componente
export default CountryDropdown;

