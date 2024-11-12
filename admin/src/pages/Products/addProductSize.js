// I. Importaciones necesarias
import React, { useContext, useEffect, useRef, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { MdDelete } from "react-icons/md";
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
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

// III. Definición del componente AddProductSize
const AddProductSize = () => {
    // IV. Definición de estados
    const [editId, setEditId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productSizeData, setProductSizeData] = useState([]);
    const [formFields, setFormFields] = useState({ size: '' });

    const navigate = useNavigate(); // Hook para navegación
    const input = useRef();
    const context = useContext(MyContext);

    // V. Manejar cambios en el formulario
    const inputChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    };

    // VI. Efecto para obtener los datos de tamaño del producto al montar el componente
    useEffect(() => {
        fetchDataFromApi("/api/productSIZE").then((res) => {
            setProductSizeData(res);
        });
    }, []);

    // VII. Función para agregar o editar tamaño del producto
    const addProductSize = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('size', formFields.size);

        if (formFields.size === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Por favor agregue el tamaño del producto'
            });
            return false;
        }

        setIsLoading(true);

        if (editId === "") {
            postData('/api/productSIZE/create', formFields).then(res => {
                setIsLoading(false);
                setFormFields({ size: "" });
                fetchDataFromApi("/api/productSIZE").then((res) => {
                    setProductSizeData(res);
                });
            });
        } else {
            editData(`/api/productSIZE/${editId}`, formFields).then((res) => {
                fetchDataFromApi("/api/productSIZE").then((res) => {
                    setProductSizeData(res);
                    setEditId("");
                    setIsLoading(false);
                    setFormFields({ size: "" });
                });
            });
        }
    };

    // VIII. Función para eliminar tamaño del producto
    const deleteItem = (id) => {
        deleteData(`/api/productSIZE/${id}`).then((res) => {
            fetchDataFromApi("/api/productSIZE").then((res) => {
                setProductSizeData(res);
            });
        });
    };

    // IX. Función para actualizar datos de tamaño del producto
    const updateData = (id) => {
        input.current.focus();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        fetchDataFromApi(`/api/productSIZE/${id}`).then((res) => {
            setEditId(id);
            setFormFields({ size: res.size });
        });
    };

    // X. Renderización del componente
    return (
        <div className="right-content w-100">
            {/* XI. Encabezado con breadcrumbs */}
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Agregar Tamaño del Producto</h5>
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
                        label="Tamaño del Producto"
                        href="#"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Agregar Tamaño del Producto"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            {/* XII. Formulario para agregar o editar tamaño del producto */}
            <form className='form' onSubmit={addProductSize}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>TAMAÑO DEL PRODUCTO</h6>
                                        <input type='text' name="size" value={formFields.size} onChange={inputChange} ref={input} />
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

            {/* XIII. Tabla de tamaños del producto */}
            {productSizeData.length !== 0 &&
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='card p-4 mt-0'>
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered table-striped v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>TAMAÑO DEL PRODUCTO</th>
                                            <th width="25%">ACCIÓN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productSizeData?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.size}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button className="success" color="success" onClick={() => updateData(item.id)}><FaPencilAlt /></Button>
                                                        <Button className="error" color="error" onClick={() => deleteItem(item.id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

// XIV. Exportación del componente
export default AddProductSize;
