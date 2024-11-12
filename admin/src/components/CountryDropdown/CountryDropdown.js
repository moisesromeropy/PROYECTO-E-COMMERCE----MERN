// I. Importaciones necesarias
import React, { useContext, useEffect, useState, forwardRef } from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
import Dialog from '@mui/material/Dialog';
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { MyContext } from '../../App';
import { useParams } from "react-router-dom";

// II. Definición de la transición para el diálogo
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// III. Definición del componente CountryDropdown
const CountryDropdown = (props) => {
    // IV. Definición de los estados
    const [isOpenModal, setisOpenModal] = useState(false);
    const [selectedTab, setselectedTab] = useState(null);
    const [countryList, setcountryList] = useState([]);

    // V. Uso del contexto
    const context = useContext(MyContext);

    // VI. Función para seleccionar un país
    const selectCountry = (index, country) => {
        setselectedTab(index);
        setisOpenModal(false);
        context.setselectedCountry(country);
    }

    // VII. Uso de parámetros de la URL
    let { id } = useParams();

    // VIII. Efecto para establecer la lista de países y el país seleccionado
    useEffect(() => {
        setcountryList(context.countryList);
        context.setselectedCountry(props.selectedLocation);
    }, []);

    // IX. Función para filtrar la lista de países
    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();

        if (keyword !== "") {
            const list = countryList.filter((item) => {
                return item.country.toLowerCase().includes(keyword);
            });
            setcountryList(list);
        } else {
            setcountryList(context.countryList);
        }
    }

    // X. Renderizado del componente
    return (
        <>
            <Button className='countryDrop' onClick={() => { setisOpenModal(true); setcountryList(context.countryList); }}>
                <div className='info d-flex flex-column'>
                    <span className='name'>{context.selectedCountry !== "" ? context.selectedCountry?.length > 10 ? context.selectedCountry?.substr(0, 10) + '...' : context.selectedCountry : 'Seleccionar Ubicación'}</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>

            <Dialog open={isOpenModal} onClose={() => setisOpenModal(false)} className='locationModal' TransitionComponent={Transition}>
                <h4 className='mb-0'>Elige tu ubicación de entrega</h4>
                <p>Introduce tu dirección y especificaremos la oferta para tu área.</p>
                <Button className='close_' onClick={() => setisOpenModal(false)}><MdClose /></Button>

                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Busca tu área...' onChange={filterList} />
                    <Button><IoIosSearch /></Button>
                </div>

                <ul className='countryList mt-3'>
                    {
                        countryList?.length !== 0 && countryList?.map((item, index) => {
                            return (
                                <li key={index}><Button onClick={() => selectCountry(index, item.country)}
                                    className={`${selectedTab === index ? 'active' : ''}`}
                                >{item.country}</Button></li>
                            )
                        })
                    }
                </ul>
            </Dialog>
        </>
    );
}

export default CountryDropdown;
