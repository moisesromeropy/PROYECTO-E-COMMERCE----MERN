// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { Chart } from "react-google-charts";
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Rating from '@mui/material/Rating';
import { deleteData, fetchDataFromApi } from "../../utils/api";
import DashboardBox from "./components/dashboardBox";

// II. Datos y opciones del gráfico
export const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
];

export const options = {
    backgroundColor: 'transparent',
    chartArea: { width: '100%', height: '100%' },
};

// III. Definición del Componente Dashboard
const Dashboard = () => {
    // IV. Definición de los Estados
    const [anchorEl, setAnchorEl] = useState(null);
    const [showBy, setShowBy] = useState(8);
    const [categoryVal, setCategoryVal] = useState('all');
    const [productList, setProductList] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalProductsReviews, setTotalProductsReviews] = useState(0);
    const [totalSales, setTotalSales] = useState(0);

    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;
    
    const context = useContext(MyContext);

    // V. Efecto para cargar datos al montar el componente
    useEffect(() => {
        context.setisHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(40);

        // Agrupamos todas las llamadas a la API
        const fetchInitialData = async () => {
            try {
                const productRes = await fetchDataFromApi("/api/products/pagina?page=1&perPage=8");
                setProductList(productRes);

                const userRes = await fetchDataFromApi("/api/user/get/count");
                console.log(userRes);
                setTotalUsers(userRes.count);

                const orderRes = await fetchDataFromApi("/api/orders/get/count");
                setTotalOrders(orderRes.orderCount);

                const productCountRes = await fetchDataFromApi("/api/products/get/count");
                setTotalProducts(productCountRes.productsCount);

                const productReviewCountRes = await fetchDataFromApi("/api/productReviews/get/count");
                setTotalProductsReviews(productReviewCountRes.productsReviews);

                const ordersRes = await fetchDataFromApi("/api/orders/");
                let sales = 0;
                ordersRes.forEach(order => {
                    sales += parseInt(order.amount);
                });
                setTotalSales(sales);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                context.setProgress(100);
            }
        };
        fetchInitialData();                               
    }, []);

    // VI. Función para eliminar un producto
    const deleteProduct = async (id) => {
        context.setProgress(40);
        try {
            await deleteData(`/api/products/${id}`);
            context.setAlertBox({
                open: true,
                error: false,
                msg: '¡Producto eliminado!'
            });
            const productRes = await fetchDataFromApi("/api/products/pagina?page=1&perPage=8");
            setProductList(productRes);
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            context.setProgress(100);
        }
    };

    // VII. Función para manejar el cambio de página
    const handleChange = async (event, value) => {
        context.setProgress(40);
        try {
            const res = await fetchDataFromApi(`/api/products/pagina?page=${value}&perPage=8`);
            setProductList(res);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            context.setProgress(100);
        }
    };

    // VIII. Función para manejar la apertura y cierre del menú
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // IX. Función para mostrar productos por página
    const showPerPage = async (e) => {
        setShowBy(e.target.value);
        context.setProgress(40);
        try {
            const res = await fetchDataFromApi(`/api/products/pagina?page=1&perPage=${e.target.value}`);
            setProductList(res);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            context.setProgress(100);
        }
    };

    // X. Función para manejar el cambio de categoría
    const handleChangeCategory = async (event) => {
        setCategoryVal(event.target.value);
        console.log(event.target.value)
        context.setProgress(40);
        try {
            const res = event.target.value === "all"
                ? await fetchDataFromApi(`/api/products/pagina?page=1&perPage=8`)
                : await fetchDataFromApi(`/api/products/categoria?category=${event.target.value}`);
            setProductList(res);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            context.setProgress(100);
        }
    };

    // XI. Renderización del componente
    return (
        <>
            <div className="right-content w-100">
                {/* XII. Sección del dashboard con los cuadros de métricas */}
                <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#bd1df2", "#cc03f9"]} icon={<FaUserCircle />} grow={true} title="Total de Usuarios" count={totalUsers} />
                            <DashboardBox color={["#bd1df2", "#cc03f9"]} icon={<IoMdCart />} title="Total de Órdenes" count={totalOrders} />
                            <DashboardBox color={["#bd1df2", "#cc03f9"]} icon={<MdShoppingBag />} title="Total de Productos" count={totalProducts} />
                            <DashboardBox color={["#bd1df2", "#cc03f9"]} icon={<GiStarsStack />} title="Total de Reseñas" count={totalProductsReviews} />
                        </div>
                    </div>
                    <div className="col-md-4 pl-0 d-none">
                        <div className="box graphBox">
                            <div className="d-flex align-items-center w-100 bottomEle">
                                <h6 className="text-white mb-0 mt-0">Total de ventas</h6>
                            </div>
                            <h3 className="text-white font-weight-bold">{totalSales?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h3>
                            <Chart
                                chartType="PieChart"
                                width="100%"
                                height="170px"
                                data={data}
                                options={options}
                            />
                        </div>
                    </div>
                </div>

                {/* XIII. Tabla de productos más vendidos */}
                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Productos más vendidos</h3>
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Mostrar por:</h4>
                            <FormControl size="small" className="w-100">
                                <InputLabel id="show-by-label">Mostrar por:</InputLabel>
                                <Select
                                    value={showBy}
                                    onChange={showPerPage}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="show-by-label"
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
                                <FormHelperText>Selecciona el número de productos por página</FormHelperText>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>Categorizar por:</h4>
                            <FormControl size="small" className="w-100">
                                <InputLabel id="categorize-by-label">Categorizar por:</InputLabel>
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="categorize-by-label"
                                    className="w-100"
                                >
                                    <MenuItem value="all">
                                        <em value={"all"}>Todos</em>
                                    </MenuItem>
                                    {
                                        context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => (
                                            
                                                <MenuItem className="text-capitalize" value={cat._id} key={index}>{cat.name}</MenuItem>
                                            
                                        ))
                                    }
                                </Select>
                                <FormHelperText>Selecciona una categoría para filtrar:</FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '300px' }}>PRODUCTOS</th>
                                    <th>Categoría</th>
                                    <th>Subcategoría</th>
                                    <th>Marca</th>
                                    <th>Precio</th>
                                    <th>Calificación</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productList?.products?.length !== 0 && productList?.products?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0">
                                                                <LazyLoadImage
                                                                    alt={"image"}
                                                                    effect="blur"
                                                                    className="w-100"
                                                                    src={item.images[0]}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="info pl-3">
                                                            <h6>{item?.name}</h6>
                                                            <p>{item?.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item?.category?.name}</td>
                                                <td>{item?.subCat?.subCat}</td>
                                                <td>{item?.brand}</td>
                                                <td>
                                                    <div style={{ width: '70px' }}>
                                                        <del className="old">US$ {item?.oldPrice}</del>
                                                        <span className="new text-danger">US$ {item?.price}</span>
                                                    </div>
                                                </td>
                                                <td><Rating name="read-only" defaultValue={item?.rating} precision={0.5} size="small" readOnly /></td>
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
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            productList?.totalPages > 1 &&
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

// XII. Exportación del Componente
export default Dashboard;
