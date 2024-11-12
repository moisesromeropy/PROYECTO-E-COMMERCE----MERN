// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate, useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import { deleteData, deleteImages, editData, fetchDataFromApi, postData, uploadImage } from '../../utils/api';

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

// III. Definición del componente EditCategory
const EditCategory = () => {
    // IV. Definición de los estados
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        images: '',
        color: ''
    });
    const [category, setcategory] = useState([]);

    let { id } = useParams(); // Obtiene el ID de la categoría de la URL
    const formdata = new FormData(); // Para manejar archivos
    const navigate = useNavigate(); // Para la navegación
    const context = useContext(MyContext); // Uso del contexto

    // V. Efecto para cargar datos iniciales
    useEffect(() => {
        context.setProgress(20); // Inicia el progreso de carga


        // Carga los datos de la categoría actual
        fetchDataFromApi(`/api/category/${id}`).then((res) => {
            setcategory(res);
            setFormFields({
                name: res.name,
                color: res.color,
                images: res.images
            });
            context.setProgress(100); // Finaliza el progreso de carga
        });
    }, []);

    // VI. Función para manejar cambios en los campos del formulario
    const changeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

  

    // IX. Función para editar una categoría
    const editCat = (e) => {
        e.preventDefault();


        if (formFields.name !== "" && formFields.color !== "") {
            setIsLoading(true);

            editData(`/api/category/${id}`, formFields).then(() => {
                setIsLoading(false);
                context.fetchCategory();
                deleteData("/api/imageUpload/deleteAllImages");
                navigate('/category');
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor complete todos los detalles'
            });
        }
    };

    // X. Renderizado del componente
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Edit Category</h5>
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
                            label="Editar Categoría"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={editCat}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                {/* XI. Campo para el nombre de la categoría */}
                                <div className='form-group'>
                                    <h6>Nombre de la categoría</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={changeInput} />
                                </div>

                                {/* XII. Campo para el color de la categoría */}
                                <div className='form-group'>
                                    <h6>Color</h6>
                                    <input type='text' name='color' value={formFields.color} onChange={changeInput} />
                                </div>
                                <div className='form-group'>
                                    <h6>URL de imagen</h6>
                                    <input type='text' name='images' value={formFields.images} onChange={changeInput} />
                                </div>
                               
                                    <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                        <FaCloudUploadAlt /> &nbsp;
                                        {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}
                                    </Button>
                                
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

// XIV. Exportación del componente
export default EditCategory;
