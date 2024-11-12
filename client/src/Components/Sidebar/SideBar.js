// I. Importación de módulos y componentes
import React, { useEffect } from 'react'; // Importación de React y el hook useEffect
import FormGroup from '@mui/material/FormGroup'; // Importación del componente FormGroup de MUI
import FormControlLabel from '@mui/material/FormControlLabel'; // Importación del componente FormControlLabel de MUI
import Checkbox from '@mui/material/Checkbox'; // Importación del componente Checkbox de MUI
import RangeSlider from 'react-range-slider-input'; // Importación del componente RangeSlider
import 'react-range-slider-input/dist/style.css'; // Importación del CSS para RangeSlider
import { useContext, useState } from 'react'; // Importación de hooks de React
import { Link } from 'react-router-dom'; // Importación del componente Link de react-router-dom
import Radio from '@mui/material/Radio'; // Importación del componente Radio de MUI
import RadioGroup from '@mui/material/RadioGroup'; // Importación del componente RadioGroup de MUI
import { useParams } from 'react-router-dom'; // Importación del hook useParams de react-router-dom
import Rating from '@mui/material/Rating'; // Importación del componente Rating de MUI
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado

// II. Definición del componente Sidebar
const Sidebar = (props) => {
    // II.a Estado local para manejar los valores de los filtros
    const [value, setValue] = useState([100, 100000]); // Estado para el rango de precios
    const [value2, setValue2] = useState(0); // Estado para un valor adicional (no usado)
    const [subCatId, setSubCatId] = useState(''); // Estado para el ID de la subcategoría seleccionada
    const [filterSubCat, setfilterSubCat] = useState(''); // Estado para el filtro de subcategoría
    const [isOpenFilter, setIsOpenFilter] = useState(false); // Estado para controlar la visibilidad del filtro

    const { subCategoryData, isLoading } = useContext(MyContext); // Uso del contexto personalizado
    const { id } = useParams(); // Uso del hook useParams para obtener parámetros de la URL

    // III. useEffect para actualizar subCatId cuando cambia el parámetro id
    useEffect(() => {
        setSubCatId(id);
    }, [id]);

    // IV. useEffect para actualizar isOpenFilter cuando cambian las props
    useEffect(() => {
        setIsOpenFilter(props.isOpenFilter);
    }, [props.isOpenFilter]);

    // V. Función para manejar cambios en el filtro de subcategoría
    const handleChange = (event) => {
        setfilterSubCat(event.target.value);
        props.filterData(event.target.value);
        setSubCatId(event.target.value);
    };

    // VI. useEffect para filtrar por precio cuando cambian los valores del rango o el id
    useEffect(() => {
        props.filterByPrice(value, subCatId);
    }, [value, subCatId]);

    // VII. Función para filtrar por calificación
    const filterByRating = (rating) => {
        props.filterByRating(rating, subCatId);
    };

    // VIII. Renderizado del componente
    return (
        <>
            <div className={`sidebar ${isOpenFilter === true && 'open'}`}>
                {isLoading ? (
                    <p>Cargando categorías...</p>
                ) : (
                    <>
                        <div className="filterBox">
                            <h6>Categoria de Productos</h6>

                            <div className='scroll'>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={filterSubCat}
                                    onChange={handleChange}
                                >
                                    {
                                        subCategoryData?.length !== 0 && subCategoryData?.map((item, index) => {
                                            return (
                                                <FormControlLabel key={index} value={item?.id} control={<Radio />} label={item?.subCat} />
                                            );
                                        })
                                    }
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="filterBox">
                            <h6>Filtrar por precio</h6>

                            <RangeSlider value={value} onInput={setValue} min={100} max={60000} step={5} />

                            <div className='d-flex pt-2 pb-2 priceRange'>
                                <span>From: <strong className='text-dark'>Rs: {value[0]}</strong></span>
                                <span className='ml-auto'>To: <strong className='text-dark'>Rs: {value[1]}</strong></span>
                            </div>
                        </div>

                        <div className="filterBox">
                            <h6>Filtrar por calificación</h6>

                            <div className='scroll pl-0'>
                                <ul>
                                    <li onClick={() => filterByRating(5)} className='cursor'>
                                        <Rating name="read-only" value={5} readOnly size="small" />
                                    </li>
                                    <li onClick={() => filterByRating(4)} className='cursor'>
                                        <Rating name="read-only" value={4} readOnly size="small" />
                                    </li>
                                    <li onClick={() => filterByRating(3)} className='cursor'>
                                        <Rating name="read-only" value={3} readOnly size="small" />
                                    </li>
                                    <li onClick={() => filterByRating(2)} className='cursor'>
                                        <Rating name="read-only" value={2} readOnly size="small" />
                                    </li>
                                    <li onClick={() => filterByRating(1)} className='cursor'>
                                        <Rating name="read-only" value={1} readOnly size="small" />
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <br />

                        <Link to="#"><img src='https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif' className='w-100' alt="Sidebar Banner" /></Link>
                    </>
                )}
            </div>
        </>
    );
};

export default Sidebar; // IX. Exportación del componente
