// I. Importaciones necesarias
import Sidebar from "../../Components/Sidebar/SideBar"; // Importación del componente Sidebar
import Button from '@mui/material/Button'; // Importación del componente Button de Material-UI
import { IoIosMenu } from "react-icons/io"; // Importación de íconos de react-icons
import { CgMenuGridR } from "react-icons/cg";
import { HiViewGrid } from "react-icons/hi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from '@mui/material/Menu'; // Importación de componentes de menú de Material-UI
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from "react"; // Importación de hooks de React
import ProductItem from "../../Components/ProductItem/ProductItem"; // Importación del componente ProductItem
import Pagination from '@mui/material/Pagination'; // Importación del componente Pagination de Material-UI
import { useParams } from "react-router-dom"; // Importación del hook useParams de react-router-dom
import { fetchDataFromApi } from "../../utils/api"; // Importación de la función fetchDataFromApi
import CircularProgress from '@mui/material/CircularProgress'; // Importación del componente CircularProgress de Material-UI
import { FaFilter } from "react-icons/fa";
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto MyContext

// II. Definición del componente SearchPage
const SearchPage = () => {
    // II.a Definición de estados locales
    const [anchorEl, setAnchorEl] = useState(null); // Estado para el ancla del menú
    const [productView, setProductView] = useState('four'); // Estado para la vista de productos
    const [productData, setProductData] = useState([]); // Estado para los datos de productos
    const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga
    const openDropdown = Boolean(anchorEl); // Estado para abrir el menú desplegable
    const [isOpenFilter, setIsOpenFilter] = useState(false); // Estado para abrir el filtro

    const context = useContext(MyContext); // Uso del contexto MyContext
    const { searchTerm } = useParams(); // Obtener el término de búsqueda de la URL

    // II.b Funciones para manejar eventos
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePageChange = (event, value) => {
        context.setPage(value);
    };

    // III. useEffect para cargar datos de productos al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true);
        fetchDataFromApi(`/api/products?search=${searchTerm}&page=${context.page}`)
            .then((res) => {
                setProductData(res.products);
                context.setTotalPages(res.totalPages);
                setIsLoading(false);
            });
    }, [searchTerm, context.page]);

    // Función para filtrar datos por subcategoría
    const filterData = (subCatId) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/products?subCatId=${subCatId}`).then((res) => {
            setProductData(res.products);
            setIsLoading(false);
        });
    };

    // Función para filtrar datos por rango de precios
    const filterByPrice = (price, subCatId) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products);
            setIsLoading(false);
        });
    };

    // Función para filtrar datos por calificación
    const filterByRating = (rating, subCatId) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/products?rating=${rating}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products);
            setIsLoading(false);
        });
    };

    // Función para abrir los filtros
    const openFilters = () => {
        setIsOpenFilter(!isOpenFilter);
    };

    // IV. Renderizado del componente SearchPage
    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} isOpenFilter={isOpenFilter} />

                        <div className="content_right">
                            <div className="showBy mt-0 mb-3 d-flex align-items-center">
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button className={productView === 'one' && 'act'} onClick={() => setProductView('one')}><IoIosMenu /></Button>
                                    <Button className={productView === 'three' && 'act'} onClick={() => setProductView('three')}><CgMenuGridR /></Button>
                                    <Button className={productView === 'four' && 'act'} onClick={() => setProductView('four')}><TfiLayoutGrid4Alt /></Button>
                                    <Button className={productView === 'grid' && 'act'} onClick={() => setProductView('grid')}><HiViewGrid /></Button>
                                </div>

                                <div className="ml-auto showByFilter">
                                    <Button onClick={handleClick}>Mostrar <FaAngleDown /></Button>
                                    <Menu
                                        className="w-100 showPerPageDropdown"
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropdown}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>10</MenuItem>
                                        <MenuItem onClick={handleClose}>20</MenuItem>
                                        <MenuItem onClick={handleClose}>30</MenuItem>
                                        <MenuItem onClick={handleClose}>40</MenuItem>
                                        <MenuItem onClick={handleClose}>50</MenuItem>
                                        <MenuItem onClick={handleClose}>60</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className="productListing">
                                {isLoading ? (
                                    <div className="loading d-flex align-items-center justify-content-center">
                                        <CircularProgress color="inherit" />
                                    </div>
                                ) : (
                                    <>
                                        {productData?.length !== 0 && productData?.map((item, index) => (
                                            <ProductItem key={index} itemView={productView} item={item} />
                                        ))}
                                    </>
                                )}
                            </div>

                            <Pagination
                                count={context.totalPages}
                                page={context.page}
                                onChange={handlePageChange}
                                color="primary"
                                className="pagination"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {context.windowWidth < 992 && (
                <>
                    {context.isOpenNav === false && (
                        <div className="fixedBtn row">
                            <div className="col">
                                <Button className='btn-blue bg-red btn-lg btn-big' onClick={openFilters}>
                                    <FaFilter />
                                    {isOpenFilter ? 'Cerrar Filtros' : 'Abrir Filtros'}
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

// V. Exportación del componente SearchPage
export default SearchPage;
