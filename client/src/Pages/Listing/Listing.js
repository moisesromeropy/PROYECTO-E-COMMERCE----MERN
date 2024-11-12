// I. Importación de componentes y dependencias
import Sidebar from "../../Components/Sidebar/SideBar"; // Importación del componente Sidebar
import Button from '@mui/material/Button'; // Importación del componente Button de Material-UI
import { IoIosMenu } from "react-icons/io"; // Importación de iconos de react-icons
import { CgMenuGridR } from "react-icons/cg";
import { HiViewGrid } from "react-icons/hi";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from '@mui/material/Menu'; // Importación del componente Menu de Material-UI
import MenuItem from '@mui/material/MenuItem'; // Importación del componente MenuItem de Material-UI
import { useContext, useEffect, useState } from "react"; // Importación de hooks de React
import ProductItem from "../../Components/ProductItem/ProductItem"; // Importación del componente ProductItem
import Pagination from '@mui/material/Pagination'; // Importación del componente Pagination de Material-UI

import { useParams } from "react-router-dom"; // Importación del hook useParams de react-router-dom
import { fetchDataFromApi } from "../../utils/api"; // Importación de la función fetchDataFromApi
import CircularProgress from '@mui/material/CircularProgress'; // Importación del componente CircularProgress de Material-UI
import { FaFilter } from "react-icons/fa"; // Importación de iconos de react-icons

import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto MyContext

// II. Definición del componente Listing
const Listing = () => {

    // Definición de los estados con useState
    const [anchorEl, setAnchorEl] = useState(null); // Estado para el anclaje del menú
    const [productView, setProductView] = useState('four'); // Estado para la vista del producto
    const [productData, setProductData] = useState([]); // Estado para los datos de los productos
    const [isLoading, setisLoading] = useState(false); // Estado para indicar si está cargando
    const [filterId, setFilterId] = useState(""); // Estado para el ID del filtro

    const [isOpenFilter, setIsOpenFilter] = useState(false); // Estado para abrir/cerrar los filtros

    const openDropdown = Boolean(anchorEl); // Estado derivado para abrir/cerrar el menú desplegable

    const context = useContext(MyContext); // Uso del contexto MyContext

    // Definición de las funciones manejadoras de eventos
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { id } = useParams(); // Obtención de parámetros de la URL

    // III. Efecto para obtener datos cuando cambia el ID
    useEffect(() => {
        window.scrollTo(0, 0);
        setFilterId("");

        let url = window.location.href;
        let apiEndPoint = "";

        // if (url.includes('subCat')) {
        //     apiEndPoint = `/api/products?subCat=${id}&location=${localStorage.getItem("location")}`;
        // }
   
            apiEndPoint = `/api/products/categoria2/${id}`;
        

        setisLoading(true);
        fetchDataFromApi(apiEndPoint).then((res) => {
            console.log(res.products);
           
                setProductData(res.products);
            
            setisLoading(false);
        }).catch(() => {
            setProductData([]);
            setisLoading(false);
        });
    }, [id]);

    // // IV. Funciones para filtrar datos
    // const filterData = (subCatId) => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //     });
    //     setFilterId(subCatId);
    //     setisLoading(true);

    //     fetchDataFromApi(`/api/products?subCatId=${subCatId}&location=${localStorage.getItem("location")}`).then((res) => {
    //         if (Array.isArray(res.products)) {
    //             setProductData(res.products);
    //         } else {
    //             setProductData([]); // Asegura que siempre tengamos un array
    //         }
    //         setisLoading(false);
    //     }).catch(() => {
    //         setProductData([]);
    //         setisLoading(false);
    //     });
    // };

    // const filterByPrice = (price, subCatId) => {
    //     var window_url = window.location.href;
    //     var api_EndPoint = "";

    //     if (filterId === "") {
    //         if (window_url.includes('subCat')) {
    //             api_EndPoint = `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${id}&location=${localStorage.getItem("location")}`;
    //         }
    //         if (window_url.includes('category')) {
    //             api_EndPoint = `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${id}&location=${localStorage.getItem("location")}`;
    //         }
    //     }
    //     if (filterId !== "") {
    //         api_EndPoint = `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${filterId}&location=${localStorage.getItem("location")}`;
    //     }

    //     setisLoading(true);

    //     fetchDataFromApi(api_EndPoint).then((res) => {
    //         if (Array.isArray(res.products)) {
    //             setProductData(res.products);
    //         } else {
    //             setProductData([]); // Asegura que siempre tengamos un array
    //         }
    //         setisLoading(false);
    //     }).catch(() => {
    //         setProductData([]);
    //         setisLoading(false);
    //     });
    // };

    // const filterByRating = (rating, subCatId) => {
    //     setisLoading(true);

    //     let url = window.location.href;
    //     let apiEndPoint = "";

    //     if (url.includes('subCat')) {
    //         apiEndPoint = `/api/products?rating=${rating}&subCatId=${id}&location=${localStorage.getItem("location")}`;
    //     }
    //     if (url.includes('category')) {
    //         apiEndPoint = `/api/products?rating=${rating}&category=${id}&location=${localStorage.getItem("location")}`;
    //     }

    //     fetchDataFromApi(apiEndPoint).then((res) => {
    //         if (Array.isArray(res.products)) {
    //             setProductData(res.products);
    //         } else {
    //             setProductData([]); // Asegura que siempre tengamos un array
    //         }
    //         setisLoading(false);
    //         window.scrollTo({
    //             top: 0,
    //             behavior: 'smooth',
    //         });
    //     }).catch(() => {
    //         setProductData([]);
    //         setisLoading(false);
    //     });
    // };

    // V. Función para manejar el cambio de página en la paginación
    const handleChange = (event, value) => {
        setisLoading(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        fetchDataFromApi(`/api/products?subCatId=${id}&page=${value}&perPage=6&location=${localStorage.getItem("location")}`).then((res) => {
            if (Array.isArray(res.products)) {
                setProductData(res.products);
            } else {
                setProductData([]); // Asegura que siempre tengamos un array
            }
            setisLoading(false);
        }).catch(() => {
            setProductData([]);
            setisLoading(false);
        });
    };

    const openFilters = () => {
        setIsOpenFilter(!isOpenFilter);
    };

    // VI. Renderizado del componente
    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        {/* <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} isOpenFilter={isOpenFilter} /> */}
                        <div className="content_right">
                            <div className="showBy mt-0 mb-3 d-flex align-items-center">
                            <div className="d-flex align-items-center btnWrapper">
    <Button className={productView === 'one' ? 'act' : ''} onClick={() => setProductView('one')}>
        <IoIosMenu />
    </Button>
    <Button className={productView === 'three' ? 'act' : ''} onClick={() => setProductView('three')}>
        <CgMenuGridR />
    </Button>
    <Button className={productView === 'four' ? 'act' : ''} onClick={() => setProductView('four')}>
        <TfiLayoutGrid4Alt />
    </Button>
</div>

                                <div className="ml-auto showByFilter">
                                    <Button onClick={handleClick}>Muestra 9 <FaAngleDown /></Button>
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
                                {isLoading === true ?
                                    <div className="loading d-flex align-items-center justify-content-center">
                                        <CircularProgress color="inherit" />
                                    </div> :
                                    <>
                                    {Array.isArray(productData) && productData.length > 0 ? (
                                      productData.map((item, index) => (
                                        <ProductItem key={index} itemView={productView} item={item} />
                                      ))
                                    ) : (
                                      <p>Producto no disponible</p>
                                    )}
                                  </>
                                  
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {context.windowWidth < 992 &&
                <>
                    {context.isOpenNav === false &&
                        <div className="fixedBtn row">
                            <div className="col">
                                <Button className='btn-blue bg-red btn-lg btn-big' onClick={openFilters}>
                                    <FaFilter />
                                    {isOpenFilter === true ? 'Close Filters' : 'Open Filters'}
                                </Button>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    );
};
// VII. Exporta el componente
export default Listing;
