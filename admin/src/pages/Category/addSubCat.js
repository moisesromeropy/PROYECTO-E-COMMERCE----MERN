// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';

// II. Definición del componente StyledBreadcrumb para los breadcrumbs personalizados
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

// III. Definición del componente AddSubCat
const AddSubCat = () => {

    // IV. Definición de los estados
    // Estado para controlar si se está cargando
    const [isLoading, setIsLoading] = useState(false);
    // Estado para almacenar los datos de las categorías
    const [catData, setCatData] = useState([]);
    // Estado para almacenar el valor de la categoría seleccionada
    const [categoryVal, setCategoryVal] = useState('');
    // Estado para almacenar los campos del formulario
    const [formFields, setFormFields] = useState({
        name: '',
        slug: '',
        parentId: ''
    });

    // Hook de navegación para redirigir al usuario
    const navigate = useNavigate();
    // Uso del contexto de la aplicación
    const context = useContext(MyContext);

    // V. Cargar la lista de categorías desde la API
    useEffect(() => {
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res); // Almacena los datos de las categorías en el estado
            context.setProgress(100); // Actualiza el progreso de la carga en el contexto
        });
    }, []); // El arreglo vacío como segundo argumento asegura que este efecto solo se ejecute una vez

    // VI. Manejar cambios en los campos del formulario
    // Actualiza el estado de formFields con los valores del formulario
    const changeInput = (e) => {
        setFormFields((prevFields) => ({
            ...prevFields,
            [e.target.name]: e.target.value // Asigna el valor del campo al estado correspondiente
        }));
    }

    // VII. Manejar cambios en la selección de categoría
    // Actualiza el estado de categoryVal y formFields cuando se selecciona una nueva categoría
    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value); // Actualiza el valor de la categoría seleccionada
        setFormFields((prevFields) => ({
            ...prevFields,
            parentId: event.target.value // Asigna el ID de la categoría seleccionada al campo parentId
        }));
    };

    // VIII. Seleccionar la categoría padre
    // Asigna el ID de la categoría seleccionada al campo parentId en formFields
    const selectCat = (catName, id) => {
        setFormFields((prevFields) => ({
            ...prevFields,
            parentId: id // Asigna el ID de la categoría seleccionada
        }));
    }

    // IX. Agregar una nueva subcategoría
    const addSubCategory = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        // Asigna el nombre de la subcategoría al campo slug
        formFields.slug = formFields.name;

        // Verifica que los campos obligatorios estén completos
        if (formFields.name !== "" && formFields.parentId !== "") {
            setIsLoading(true); // Inicia la carga

            // Envía los datos del formulario a la API para crear la subcategoría
            postData(`/api/category/create`, formFields).then((res) => {
                setIsLoading(false); // Finaliza la carga
                context.fetchCategory(); // Actualiza la lista de categorías en el contexto
                deleteData("/api/imageUpload/deleteAllImages"); // Elimina todas las imágenes subidas
                navigate('/subCategory'); // Redirige a la página de subcategorías
            });

        } else {
            // Muestra un mensaje de error si los campos no están completos
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor complete todos los detalles'
            });
        }
    }

    // X. Renderizado del componente
    return (
        <>
            <div className="right-content w-100">
                {/* XI. Encabezado con breadcrumbs */}
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Add Sub Category</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Category"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add Sub Category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                {/* XII. Formulario para agregar una nueva subcategoría */}
                <form className='form' onSubmit={addSubCategory}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>

                                {/* XIII. Campo para seleccionar la categoría padre */}
                                <div className='form-group'>
                                    <h6>Categoría principal</h6>
                                    <Select
                                        value={categoryVal} // Valor de la categoría seleccionada
                                        onChange={handleChangeCategory} // Maneja el cambio en la selección
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        className='w-100'
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>

                                        {/* Mapea las categorías para crear las opciones del select */}
                                        {
                                        catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => (
                                            
                                                <MenuItem className="text-capitalize" value={cat._id} key={index}>{cat.name}</MenuItem>
                                            
                                        ))
                                    }
                                    </Select>
                                </div>

                                {/* XIV. Campo para el nombre de la subcategoría */}
                                <div className='form-group'>
                                    <h6>Sub Categoría</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={changeInput} />
                                </div>

                                {/* XV. Botón para enviar el formulario */}
                                <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                    <FaCloudUploadAlt /> &nbsp;
                                    {/* Muestra un spinner si está cargando */}
                                    {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLICAR Y VER'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

// XVI. Exportación del componente
export default AddSubCat;
