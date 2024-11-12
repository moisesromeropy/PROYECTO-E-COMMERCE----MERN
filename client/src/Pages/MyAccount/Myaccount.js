// I. Importaciones necesarias
import React, { useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { IoMdCloudUpload } from "react-icons/io";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { deleteData, editData, fetchDataFromApi, uploadImage } from '../../utils/api';
import { MyContext } from '../../MyContext/MyContext';
import NoUserImg from '../../assets/images/no-user.jpg';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

// II. Componentes auxiliares y configuración de las pestañas

// Componente CustomTabPanel para manejar el contenido de las pestañas
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

// Función auxiliar para configurar los atributos de accesibilidad de las pestañas
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// III. Componente principal MyAccount

const MyAccount = () => {
    const navigate = useNavigate(); // Hook para la navegación
    const [value, setValue] = useState(0); // Estado para manejar el valor de las pestañas
    const handleChange = (event, newValue) => setValue(newValue); // Función para cambiar las pestañas
    const context = useContext(MyContext); // Contexto para manejar alertas y otros estados globales

    // Estado para manejar las vistas previas de las imágenes
    const [previews, setPreviews] = useState([]);
    const formdata = new FormData(); // Para manejar los datos de formulario

    // Estado para manejar los campos del formulario de edición de perfil
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        images: [],
    });

    // Estado para manejar los campos del formulario de cambio de contraseña
    const [fields, setFields] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    // Estado para manejar los mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Función para limpiar los mensajes después de un tiempo
    const clearMessages = useCallback(() => {
        setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    }, []);

    // Función para obtener datos del usuario desde la API
    const fetchUserData = useCallback(async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.userId) {
            try {
                const res = await fetchDataFromApi(`/api/user/${user.userId}`);
                if (res.success) {
                    setPreviews(res.data.images || []);
                    setFormFields({
                        name: res.data.name,
                        email: res.data.email,
                        phone: res.data.phone
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Usuario no encontrado'
            });
        }
    }, [context]);

    // useEffect para verificar el token y obtener los datos del usuario al montar el componente
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signIn");
            return;
        }
        fetchUserData();
    }, [navigate, fetchUserData]);

    // Maneja el cambio de los campos del formulario de edición de perfil
    const changeInput = (e) => {
        setFormFields((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // Maneja el cambio de los campos del formulario de cambio de contraseña
    const changeInput2 = (e) => {
        setFields((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // Maneja la subida de archivos y la actualización de las vistas previas de las imágenes
    const onChangeFile = async (e, apiEndPoint) => {
        try {
            setPreviews([]);
            const files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png' || files[i].type === 'image/webp')) {
                    formdata.append('images', files[i]);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Por favor selecciona un archivo de imagen JPG o PNG válido.'
                    });
                    return;
                }
            }

            const res = await uploadImage(apiEndPoint, formdata);
            if (res.success) {
                const uniqueArray = res.data.filter((item, index) => res.data.indexOf(item) === index);
                setPreviews(uniqueArray);
                setTimeout(() => {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "¡Imágenes subidas!"
                    });
                }, 200);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Maneja la actualización de los datos del perfil del usuario
    const edituser = async (e) => {
        e.preventDefault();
        if (formFields.name && formFields.email && formFields.phone && previews.length) {
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const res = await editData(`/api/user/${user?.userId}`, {
                    ...formFields,
                    images: previews
                });
                if (res.success) {
                    await deleteData("/api/imageUpload/deleteAllImages");
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Usuario actualizado"
                    });
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.message || 'Error actualizando usuario'
                    });
                }
            } catch (error) {
                console.error('Error actualizando usuario:', error);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Error actualizando usuario'
                });
            }
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor rellena todos los campos'
            });
        }
    };

    // Maneja el cambio de contraseña del usuario
    const changePassword = async (e) => {
        e.preventDefault();
        if (fields.oldPassword && fields.password && fields.confirmPassword) {
            if (fields.password !== fields.confirmPassword) {
                setErrorMessage('La nueva contraseña y la confirmación no coinciden');
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'La nueva contraseña y la confirmación no coinciden'
                });
                clearMessages();
            } else {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user && user.id) {
                    const data = {
                        oldPassword: fields.oldPassword,
                        newPassword: fields.password
                    };
                    try {
                        const res = await editData(`/api/user/changePassword/${user.id}`, data);
                        if (res.success) {
                            setSuccessMessage('Contraseña cambiada con éxito');
                            clearMessages();
                        } else {
                            setErrorMessage(res.message || 'Error cambiando la contraseña');
                            context.setAlertBox({
                                open: true,
                                error: true,
                                msg: res.message || 'La contraseña a ser modificada no es la correcta'
                            });
                            clearMessages();
                        }
                    } catch (error) {
                        console.error('Error cambiando la contraseña:', error);
                        setErrorMessage('Error cambiando la contraseña');
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: 'Error cambiando la contraseña'
                        });
                        clearMessages();
                    }
                } else {
                    setErrorMessage('Usuario no encontrado');
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Usuario no encontrado'
                    });
                    clearMessages();
                }
            }
        } else {
            setErrorMessage('Por favor rellena todos los campos');
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor rellena todos los campos'
            });
            clearMessages();
        }
    };

    return (
        <section className='section myAccountPage'>
            <div className='container'>
                <h2 className='hd'>Mi Perfil</h2>
                <Box sx={{ width: '100%' }} className="myAccBox card border-0">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Editar perfil" {...a11yProps(0)} />
                            <Tab label="Cambiar Contraseña" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <Collapse in={successMessage !== '' || errorMessage !== ''}>
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    </Collapse>
                    <CustomTabPanel value={value} index={0}>
                        <form onSubmit={edituser}>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className='userImage'>
                                        {previews.length ? previews.map((img, index) => (
                                            <img src={img} key={index} alt="User" />
                                        )) : (
                                            <img src={NoUserImg} alt="No User" />
                                        )}
                                        <div className='overlay d-flex align-items-center justify-content-center'>
                                            <IoMdCloudUpload />
                                            <input type="file" multiple onChange={(e) => onChangeFile(e, 'http://localhost:4000/api/user/upload')} name="images" />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-8'>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className='form-group'>
                                                <TextField label="Nombre" variant="outlined" className='w-100' name="name" onChange={changeInput} value={formFields.name} />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className='form-group'>
                                                <TextField label="Email" disabled variant="outlined" className='w-100' name="email" value={formFields.email} />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className='form-group'>
                                                <TextField label="Teléfono" variant="outlined" className='w-100' name="phone" onChange={changeInput} value={formFields.phone} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <Button type="submit" className='btn-blue bg-red btn-lg btn-big'> Guardar</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <form onSubmit={changePassword}>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className='form-group'>
                                                <TextField 
                                                    label="Contraseña antigua" 
                                                    variant="outlined" 
                                                    className='w-100' 
                                                    name="oldPassword" 
                                                    onChange={changeInput2} 
                                                    value={fields.oldPassword} // Añadido valor para evitar bucles
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='form-group'>
                                                <TextField 
                                                    label="Nueva contraseña" 
                                                    variant="outlined" 
                                                    className='w-100' 
                                                    name="password" 
                                                    onChange={changeInput2} 
                                                    value={fields.password} // Añadido valor para evitar bucles
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='form-group'>
                                                <TextField 
                                                    label="Confirmar contraseña" 
                                                    variant="outlined" 
                                                    className='w-100' 
                                                    name="confirmPassword" 
                                                    onChange={changeInput2} 
                                                    value={fields.confirmPassword} // Añadido valor para evitar bucles
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <Button type="submit" className='btn-blue bg-red btn-lg btn-big'>Actualizar</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>
                </Box>
            </div>
        </section>
    );
};

// V. Exporta el componente
export default MyAccount;
