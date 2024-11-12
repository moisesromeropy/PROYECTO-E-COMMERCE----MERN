import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MdCategory } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import Rating from '@mui/material/Rating';
import { Link } from "react-router-dom";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardBox from "../Dashboard/components/dashboardBox";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// I. Importaciones necesarias

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

// III. Definición del componente Products
const Products = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [showBy, setshowBy] = useState(8);
    const [categoryVal, setcategoryVal] = useState('all');
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState();
    const [totalCategory, setTotalCategory] = useState();
    const [totalSubCategory, setTotalSubCategory] = useState();

    const open = Boolean(anchorEl);
    const context = useContext(MyContext);
    const [productList, setProductList] = useState([]);
    const ITEM_HEIGHT = 48;

    // IV. Efecto para cargar los productos al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi("/api/products/pagina?page=1&perPage=8").then((res) => {
            console.log(res);
            setProductList(res);
            context.setProgress(100);
        });

        fetchDataFromApi("/api/products/get/count").then((res) => {
            setTotalProducts(res.productsCount);
        });

        fetchDataFromApi("/api/category/get/count").then((res) => {
            setTotalCategory(res.categoryCount);
        });

        fetchDataFromApi("/api/category/subCat/get/count").then((res) => {
            setTotalSubCategory(res.categoryCount);
        });
    }, []);

    // V. Función para eliminar un producto
    const deleteProduct = (id) => {
        context.setProgress(40);
        deleteData(`/api/products/${id}`).then((res) => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted!'
            });

            fetchDataFromApi(`/api/products/pagina?page=${page}&perPage=8`).then((res) => {
                setProductList(res);
            });
            context.fetchCategory();
        });
    };

    // VI. Función para manejar el cambio de página en la paginación
    const handleChange = (event, value) => {
        context.setProgress(40);
        setPage(value);
        fetchDataFromApi(`/api/products/pagina?page=${value}&perPage=8`).then((res) => {

            setProductList(res);
            context.setProgress(100);
            window.scrollTo({
                top: 200,
                behavior: 'smooth',
            });
        });
    };

    // VII. Función para mostrar el número de productos por página
    const showPerPage = (e) => {
        setshowBy(e.target.value);
        fetchDataFromApi(`/api/products/pagina?page=${1}&perPage=${e.target.value}`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        });
    };

    // VIII. Función para manejar el cambio de categoría
    const handleChangeCategory = (event) => {
        if (event.target.value !== "all") {
            setcategoryVal(event.target.value);
            fetchDataFromApi(`/api/products?category=${event.target.value}`).then((res) => {
                setProductList(res);
                context.setProgress(100);
            });
        }
        if (event.target.value === "all") {
            setcategoryVal(event.target.value);
            fetchDataFromApi(`/api/products?page=${1}&perPage=${8}`).then((res) => {
                setProductList(res);
                context.setProgress(100);
            });
        }
    };

    // IX. Renderización del componente
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Product List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Products"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                        <Link to="/product/upload">
                            <Button className="btn-blue ml-3 pl-3 pr-3">Agregar producto</Button>
                        </Link>
                    </div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#aa15cb", "#d86ae2"]} icon={<MdShoppingBag />} title="Total Products" count={totalProducts} grow={true} />
                            <DashboardBox color={["#aa15cb", "#d86ae2"]} icon={<MdCategory />} title="Total Categories" count={totalCategory} />
                            <DashboardBox color={["#aa15cb", "#d86ae2"]} icon={<IoShieldCheckmarkSharp />} title="Total Sub Category" count={totalSubCategory} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>MOSTRAR POR:</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={showPerPage}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={60}>60</MenuItem>
                                    <MenuItem value={70}>70</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>CATEGORIAR POR:</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='w-100'
                                >
                                    <MenuItem value="all">
                                        <em value={"all"}>Todos</em>
                                    </MenuItem>
                                    {context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => (
                                        <MenuItem className="text-capitalize" value={cat.id} key={index}>{cat.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '300px' }}>PRODUCTOS</th>
                                    <th>CATEGORÍA</th>
                                    <th>SUB CATEGORÍA</th>
                                    <th>MARCA</th>
                                    <th>PRECIO</th>
                                    <th>CALIFICACIÓN</th>
                                    <th>DESCUENTO</th>
                                    <th>PRODUCTO RAMS</th>
                                    <th>PESO DEL PRODUCTO</th>
                                    <th>MEDIDA DEL PRODUCTO</th>
                                    <th>ACCION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList?.products?.length !== 0 && productList?.products?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0">
                                                        <LazyLoadImage
                                                            alt={"image"}
                                                            effect="blur"
                                                            className="w-100"
                                                            src={item.images[0]} />
                                                    </div>
                                                </div>
                                                <div className="info pl-3">
                                                    <h6>{item?.name}</h6>
                                                    <p>{item?.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item?.category?.name}</td>
                                        <td>{item?.subCat}</td>
                                        <td>{item?.brand}</td>
                                        <td>
                                            <div style={{ width: '70px' }}>
                                                <del className="old">US$ {item?.oldPrice}</del>
                                                <span className="new text-danger">US$ {item?.price}</span>
                                            </div>
                                        </td>
                                        <td><Rating name="read-only" defaultValue={item?.rating} precision={0.5} size="small" readOnly /></td>
                                        <td>{item?.discount}</td>
                                        <td>{item?.productRam?.map((ram, ramIndex) => (
                                            <span className="badge badge-primary mr-2" key={ramIndex}>{ram}</span>
                                        ))}</td>
                                        <td>{item?.productWeight?.map((weight, weightIndex) => (
                                            <span className="badge badge-primary mr-2" key={weightIndex}>{weight}</span>
                                        ))}</td>
                                        <td>{item?.size?.map((size, sizeIndex) => (
                                            <span className="badge badge-primary mr-2" key={sizeIndex}>{size}</span>
                                        ))}</td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/product/details/${item.id}`}>
                                                    <Button className="secondary" color="secondary"><FaEye /></Button>
                                                </Link>
                                                <Link to={`/product/edit/${item.id}`}>
                                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                                </Link>
                                                <Button className="error" color="error" onClick={() => deleteProduct(item?.id)}><MdDelete /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {productList?.totalPages > 1 &&
                            <div className="d-flex tableFooter">
                                <Pagination count={productList?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

// X. Exportación del componente
export default Products;
