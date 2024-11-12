// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MyContext } from '../../App';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

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
    // IV. Definición de estados
    const [categoryVal, setCategoryVal] = useState('');
    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        category: '',
        subCat: '',
    });

    const navigate = useNavigate(); // Hook para navegación
    const context = useContext(MyContext);

    // V. Efecto para obtener los datos de categoría y subcategoría al montar el componente
    useEffect(() => {
        setCatData(context.catData);
        setSubCatData(context.subCatData);
    }, [context.catData, context.subCatData]);

    // VI. Manejar cambios en el formulario
    const inputChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    };

    // VII. Manejar cambios en la categoría seleccionada
    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields({ ...formFields, category: event.target.value });
    };

    // VIII. Función para agregar subcategoría
    const addSubCat = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('category', formFields.category);
        formdata.append('subCat', formFields.subCat);

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

        postData('/api/subCat/create', formFields).then(res => {
            setIsLoading(false);
            context.fetchCategory();
            navigate('/subCategory');
        });
    };

    // IX. Renderización del componente
    return (
        <div className="right-content w-100">
            {/* X. Encabezado con breadcrumbs */}
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Agregar Sub Categoría</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                        onClick={() => navigate('/dashboard')} // Navegación al Dashboard
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="Sub Categoría"
                        href="#"
                        deleteIcon={<ExpandMoreIcon />}
                        onClick={() => navigate('/subCategory')} // Navegación a la lista de subcategorías
                    />
                    <StyledBreadcrumb
                        label="Agregar Sub Categoría"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            {/* XI. Formulario para agregar subcategoría */}
            <form className='form' onSubmit={addSubCat}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='row'>
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
                                                <em>Ninguna</em>
                                            </MenuItem>
                                            {catData?.categoryList?.length !== 0 && catData?.categoryList?.map((cat, index) => (
                                                <MenuItem className="text-capitalize" value={cat.id} key={index}>{cat.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>SUB CATEGORÍA</h6>
                                        <input type='text' name="subCat" value={formFields.subCat} onChange={inputChange} />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLICAR Y VER'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

// XII. Exportación del componente
export default AddSubCat;
