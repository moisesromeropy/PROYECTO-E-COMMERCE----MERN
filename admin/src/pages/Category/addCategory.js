// I. Importaciones necesarias
// Importaciones de React y hooks
import React, { useContext, useEffect, useState } from 'react';
// Importaciones de Material-UI
import { Breadcrumbs, Chip, CircularProgress, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
// Importación de iconos de react-icons
import { FaCloudUploadAlt } from "react-icons/fa";
// Importaciones de navegación
import { useNavigate } from 'react-router-dom';
// Importación del contexto de la aplicación
import { MyContext } from '../../App';
// Importación de funciones de utilidad para llamadas API
import { postData } from '../../utils/api';

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

// III. Definición del componente AddCategory
const AddCategory = () => {

    // IV. Definición de los estados
    // Estado para controlar si se está cargando
    const [isLoading, setIsLoading] = useState(false);
    // Estado para controlar los campos del formulario
    const [formFields, setFormFields] = useState({
        name: '',
        color: '',
        slug: '',
        parentId: ''
    });

    // Obtención del contexto
    const context = useContext(MyContext);
    // Hook de navegación
    const navigate = useNavigate();

    // V. Función para manejar cambios en los campos del formulario
    // Actualiza el estado de formFields con los valores del formulario
    const changeInput = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ));
    }

    // VI. Función para agregar una categoría
    const addCat = (e) => {
        e.preventDefault();

        // Verifica que los campos obligatorios estén completos
        if (formFields.name !== "" && formFields.color !== "") {
            setIsLoading(true); // Inicia la carga
            postData(`/api/category/create`, formFields).then((res) => {
                setIsLoading(false); // Finaliza la carga
                context.fetchCategory(); // Actualiza la lista de categorías
                navigate('/category'); // Redirige a la página de categorías
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

    // VII. Renderizado del componente
    return (
        <>
            <div className="right-content w-100">
                {/* Encabezado con breadcrumbs */}
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Agregar una categoría</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Categoría"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Agregar categoría"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                {/* Formulario para agregar una nueva categoría */}
                <form className='form' onSubmit={addCat}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                {/* Campo para el nombre de la categoría */}
                                <div className='form-group'>
                                    <h6>Nombre de la categoría</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={changeInput} />
                                </div>
                                {/* Campo para el color de la categoría */}
                                <div className='form-group'>
                                    <h6>Color</h6>
                                    <input type='text' name='color' value={formFields.color} onChange={changeInput} />
                                </div>
                                <div className='form-group'>
                                    <h6>URL de imagen</h6>
                                    <input type='text' name='images' value={formFields.images} onChange={changeInput} />
                                </div>
                                {/* Botón para enviar el formulario */}
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

// VIII. Exportación del componente
export default AddCategory;
