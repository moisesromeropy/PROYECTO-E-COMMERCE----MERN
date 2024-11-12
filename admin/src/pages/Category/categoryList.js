// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { deleteData, fetchDataFromApi } from "../../utils/api";

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

// III. Definición del componente Category
const Category = () => {
    // IV. Definición de los estados
    // Estado para almacenar los datos de las categorías
    const [catData, setCatData] = useState([]);
    // Estado para almacenar la lista de categorías
    const [categoryList, setCategoryList] = useState(null);
    // Estado para manejar la paginación (página actual)
    const [page, setPage] = useState(1);
    // Estado para definir cuántas filas se mostrarán por página
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Obtención del contexto de la aplicación
    const context = useContext(MyContext);
    // Hook de navegación para redirigir al usuario
    const navigate = useNavigate();

    // V. Efecto para cargar las categorías al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0); // Desplaza la ventana hacia arriba al cargar la página
        context.setProgress(20); // Inicia el progreso de carga
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res); // Almacena los datos de las categorías en el estado
            setCategoryList(res.categoryList); // Almacena la lista de categorías en el estado
            console.log(res.categoryList)
            context.setProgress(100); // Finaliza el progreso de carga
        });
    }, []); // Solo se ejecuta una vez al montar el componente

    // VI. Función para eliminar una categoría
    const deleteCat = (id) => {
        context.setProgress(30); // Inicia el progreso de carga para la eliminación
        deleteData(`/api/category/${id}`).then(res => {
            context.setProgress(100); // Finaliza el progreso de carga para la eliminación
            fetchDataFromApi('/api/category').then((res) => {
                setCatData(res); // Actualiza los datos de las categorías en el estado
                setCategoryList(res.categoryList); // Actualiza la lista de categorías en el estado
                context.setProgress(100); // Finaliza el progreso de carga
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "¡Categoría eliminada!" // Muestra un mensaje de confirmación
                });
            });
        });
    };

    // VII. Función para manejar el cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Actualiza el estado de la página actual
    };

    // VIII. Renderizado del componente
    return (
        <>
            <div className="right-content w-100">
                {/* IX. Encabezado con breadcrumbs */}
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Category List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Categoría"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                        <Link to="/category/add">
                            <Button className="btn-blue ml-3 pl-3 pr-3">Agregar Categoría</Button>
                        </Link>
                    </div>
                </div>

                {/* X. Tabla de categorías */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>CATEGORÍA</th>
                                    <th>COLOR</th>
                                    <th>URL IMAGEN</th> {/* Nueva columna para la imagen */}
                                    <th>ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryList ? (
                                    // Mapea las categorías para crear filas en la tabla
                                    categoryList.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((item) => (
                                        <tr key={item._id}> {/* Usa item._id como la clave */}
                                            <td>{item.name}</td>
                                            <td>{item.color}</td>
                                            <td>
                                                    {item.images} 
                                            </td>
                                            <td>
                                                <div className="actions d-flex align-items-center">
                                                    <Link to={`/category/edit/${item._id}`}>
                                                        <Button className="success" color="success">
                                                            <FaPencilAlt />
                                                        </Button>
                                                    </Link>
                                                    <Button className="error" color="error" onClick={() => deleteCat(item._id)}>
                                                        <MdDelete />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No se encontraron categorías</td> {/* Actualiza colspan para incluir la nueva columna */}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* XI. Paginación */}
                    <Pagination
                        count={Math.ceil((categoryList ? categoryList.length : 0) / rowsPerPage)} // Calcula el número total de páginas
                        page={page} // Página actual
                        onChange={handleChangePage} // Manejador de cambio de página
                        color="primary" // Color del componente de paginación
                    />
                </div>
            </div>
        </>
    );
}

// XII. Exportación del componente
export default Category;
