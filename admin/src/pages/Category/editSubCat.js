// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from '../../App';
import { editData, fetchDataFromApi } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

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

// III. Definición del componente EditSubCat
const EditSubCat = () => {
    // IV. Definición de los estados
    const [data, setData] = useState([]);
    const [categoryVal, setCategoryVal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        category: '',
        subCat: '',
    });

    const navigate = useNavigate(); // Hook de navegación para redirigir al usuario
    const context = useContext(MyContext); // Uso del contexto

    let { id } = useParams(); // Obtiene el ID de la subcategoría de la URL

    // V. Efecto para cargar datos iniciales de la subcategoría
    useEffect(() => {
        fetchDataFromApi(`/api/subCat/${id}`).then((res) => {
            setData(res); // Almacena los datos de la subcategoría
            setCategoryVal(res.category.id); // Establece el valor de la categoría seleccionada
            setFormFields({
                category: res.category.id,
                subCat: res.subCat
            });
        });
    }, [id]);

    // VI. Función para manejar cambios en los campos del formulario
    const inputChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    // VII. Función para manejar el cambio de categoría seleccionada
    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields({
            ...formFields,
            category: event.target.value
        });
    };

    // VIII. Función para editar una subcategoría
    const editSubCat = (e) => {
        e.preventDefault();
        if (formFields.category === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Porfavor seleccione una categoría'
            });
            return false;
        }

        if (formFields.subCat === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor ingresa a la subcategoría'
            });
            return false;
        }

        setIsLoading(true);
        editData(`/api/subCat/${id}`, formFields).then(() => {
            setIsLoading(false);
            context.fetchCategory();
            context.fetchSubCategory();
            navigate('/subCategory');
        });
    };

    // IX. Renderizado del componente
    return (
        <div className="right-content w-100">

            {/* X. Encabezado con breadcrumbs */}
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Editar Sub categoría</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="Editar Sub categoría"
                        href="#"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Edit Category"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            {/* XI. Formulario para editar una subcategoría */}
            <form className='form' onSubmit={editSubCat}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='row'>


                                {/* XII. Campo para seleccionar la categoría */}
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>CATEGORÍA</h6>
                                        <Select
                                            value={categoryVal}
                                            onChange={handleChangeCategory}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className='w-100'
                                            name="category"
                                        >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>
                                            {context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => (
                                                <MenuItem className="text-capitalize" value={cat.id} key={index}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                {/* XIII. Campo para el nombre de la subcategoría */}
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>SUB CATEGORÍA</h6>
                                        <input type='text' name="subCat" value={formFields.subCat} onChange={inputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* XIV. Botón para enviar el formulario */}
                            <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                <FaCloudUploadAlt /> &nbsp;
                                {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLICAR Y VER'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

// XV. Exportación del componente
export default EditSubCat;
