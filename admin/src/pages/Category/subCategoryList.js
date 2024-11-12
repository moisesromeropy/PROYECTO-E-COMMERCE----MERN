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
import { IoCloseSharp } from "react-icons/io5";
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

// III. Definición del componente SubCategory
const SubCategory = () => {
    // IV. Definición de los estados
    const [catData, setCatData] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Definir el número de filas por página para la paginación
    const context = useContext(MyContext);
    const navigate = useNavigate(); // Hook de navegación para redirigir al usuario
    const [categoryList, setCategoryList] = useState(null);
    // V. Efecto para cargar las categorías al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20);
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            setCategoryList(res.categoryList); // Almacena la lista de categorías en el estado
            console.log(res.categoryList);
            context.setProgress(100);
        });
    }, []);

    // VI. Función para eliminar una categoría
    const deleteCat = (id) => {
        context.setProgress(30);
        deleteData(`/api/category/${id}`).then(() => {
            context.setProgress(100);
            fetchDataFromApi('/api/category').then((res) => {
                setCatData(res);
                setCategoryList(res.categoryList); // Actualiza la lista de categorías en el estado
                context.setProgress(100);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "¡Categoría eliminada!"
                });
            });
        });
    };

    // VII. Función para eliminar una subcategoría
    const deleteSubCat = (id) => {
        context.setProgress(30);
        deleteData(`/api/subCat/${id}`).then(() => {
            context.setProgress(100);
            fetchDataFromApi('/api/category').then((res) => {
                setCatData(res);
                setCategoryList(res.categoryList); // Actualiza la lista de categorías en el estado
                context.setProgress(100);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "¡Subcategoría eliminada!"
                });
            });
        });
    };

    // VIII. Función para manejar el cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Actualiza el estado de la página actual
    };

    // IX. Renderizado del componente
    return (
        <>
            <div className="right-content w-100">
                {/* X. Encabezado con breadcrumbs */}
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Sub Category List</h5>
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
                        <Link to="/subCategory/add">
                            <Button className="btn-blue ml-3 pl-3 pr-3">Agregar subcategoría</Button>
                        </Link>
                    </div>
                </div>

                {/* XI. Tabla de subcategorías */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px' }}>IMAGEN DE CATEGORÍA</th>
                                    <th>CATEGORÍA</th>
                                    <th>SUBCATEGORÍA</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                            {catData?.categoryList?.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((item, index) => (
    item?.children?.length !== 0 && (
        <tr key={index}>
            <td>
              
                           {item.images}
        
            </td>
            <td>{item.name}</td>
            <td>
                {item.children.map((subCat, subIndex) => (
                    <span key={subIndex} className="badge badge-primary mx-1">
                        {subCat.name}
                        <IoCloseSharp className="cursor" onClick={() => deleteSubCat(subCat._id)} />
                    </span>
                ))}
            </td>
            <td>
                <div className="actions d-flex align-items-center">
                    <Link to={`/subCategory/edit/${item._id}`}>
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
    )
))}
                            </tbody>
                        </table>
                    </div>

                    {/* XII. Paginación */}
                    <Pagination
                        count={Math.ceil(catData?.categoryList?.length / rowsPerPage)} // Calcula el número total de páginas
                        page={page} // Página actual
                        onChange={handleChangePage} // Manejador de cambio de página
                        color="primary" // Color del componente de paginación
                    />
                </div>
            </div>
        </>
    );
}

// XIII. Exportación del componente
export default SubCategory;
