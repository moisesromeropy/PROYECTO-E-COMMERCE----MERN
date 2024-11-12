// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import Button from '@mui/material/Button';
import { deleteData, deleteImages, postData, uploadImage, fetchDataFromApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// II. Definición del componente StyledBreadcrumb para los breadcrumbs personalizados
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': { backgroundColor: emphasize(backgroundColor, 0.06) },
        '&:active': { boxShadow: theme.shadows[1], backgroundColor: emphasize(backgroundColor, 0.12) },
    };
});

// III. Definición del componente AddHomeSlide
const AddHomeSlide = () => {
    // IV. Definición de los estados
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar si el formulario está en proceso de envío
    const [uploading, setUploading] = useState(false); // Estado para controlar si las imágenes están en proceso de carga
    const [formFields, setFormFields] = useState({ images: [] }); // Estado para almacenar los campos del formulario
    const [previews, setPreviews] = useState([]); // Estado para almacenar las vistas previas de las imágenes seleccionadas

    const formdata = new FormData(); // Objeto FormData para manejar la carga de archivos
    const navigate = useNavigate(); // Hook de navegación para redirigir al usuario
    const context = useContext(MyContext); // Contexto de la aplicación

    // V. Efecto para eliminar imágenes existentes al montar el componente
    useEffect(() => {
        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.forEach((item) => {
                item?.images?.forEach((img) => {
                    deleteImages(`/api/homeBanner/deleteImage?img=${img}`).then(() => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    });
                });
            });
        });
    }, []);

    // VI. Función para manejar el cambio de archivo
    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files; // Obtiene los archivos seleccionados
            setUploading(true); // Establece el estado de carga en verdadero

            for (var i = 0; i < files.length; i++) {
                // Valida el tipo de archivo
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png' || files[i].type === 'image/webp')) {
                    const file = files[i];
                    formdata.append('images', file); // Agrega el archivo al objeto FormData
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Seleccione un archivo de imagen JPG o PNG válido.'
                    });
                    return false;
                }
            }

            // Sube las imágenes al servidor
            uploadImage(apiEndPoint, formdata).then((res) => {
                fetchDataFromApi("/api/imageUpload").then((response) => {
                    let img_arr = [];
                    response?.forEach((item) => {
                        item?.images?.forEach((img) => {
                            img_arr.push(img);
                        });
                    });

                    const uniqueArray = img_arr.filter((item, index) => img_arr.indexOf(item) === index);
                    const appendedArray = [...previews, ...uniqueArray];
                    setPreviews(appendedArray); // Actualiza el estado de vistas previas

                    setTimeout(() => {
                        setUploading(false); // Finaliza la carga
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "¡Imágenes cargadas!"
                        });
                    }, 200);
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    // VII. Función para eliminar una imagen
    const removeImg = async (index, imgUrl) => {
        const imgIndex = previews.indexOf(imgUrl);
        deleteImages(`/api/homeBanner/deleteImage?img=${imgUrl}`).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "¡Imagen eliminada!"
            });
        });

        if (imgIndex > -1) {
            previews.splice(index, 1); // Elimina la imagen del array de vistas previas
        }
    };

    // VIII. Función para agregar una diapositiva al home
    const addHomeSlide = (e) => {
        e.preventDefault();
        const appendedArray = [...previews];
        formFields.images = appendedArray; // Agrega las vistas previas al objeto formFields

        if (previews.length !== 0) {
            setIsLoading(true); // Establece el estado de envío en verdadero

            // Envía los datos del formulario al servidor
            postData(`/api/homeBanner/create`, formFields).then(() => {
                setIsLoading(false); // Finaliza el envío
                context.fetchCategory(); // Actualiza las categorías
                deleteData("/api/imageUpload/deleteAllImages"); // Elimina las imágenes cargadas
                navigate('/homeBannerSlide/list'); // Redirige al usuario a la lista de diapositivas
            });
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor complete todos los detalles'
            });
            return false;
        }
    };

    // IX. Renderización del componente
    return (
        <>
            <div className="right-content w-100">
                {/* X. Encabezado con breadcrumbs */}
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Agregar pagina a Home</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Diapositiva de inicio"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Agregar diapositiva de inicio"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>
                {/* XI. Formulario para agregar diapositiva al home */}
                <form className='form' onSubmit={addHomeSlide}>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className="imagesUploadSec">
                                    <h5 class="mb-4">Media y publicado</h5>
                                    <div className='imgUploadBox d-flex align-items-center'>
                                        {previews?.length !== 0 && previews?.map((img, index) => (
                                            <div className='uploadBox' key={index}>
                                                <span className="remove" onClick={() => removeImg(index, img)}><IoCloseSharp /></span>
                                                <div className='box'>
                                                    <LazyLoadImage
                                                        alt={"image"}
                                                        effect="blur"
                                                        className="w-100"
                                                        src={img} />
                                                </div>
                                            </div>
                                        ))}
                                        <div className='uploadBox'>
                                            {uploading === true ? (
                                                <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                    <CircularProgress />
                                                    <span>Cargando...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/homeBanner/upload')} name="images" />
                                                    <div className='info'>
                                                        <FaRegImages />
                                                        <h5>Imagen cargada</h5>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <br />
                                    <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                        <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLICAR Y VER'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

// XII. Exportación del componente
export default AddHomeSlide;
