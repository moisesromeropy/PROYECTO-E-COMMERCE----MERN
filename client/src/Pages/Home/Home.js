// I. Importaciones necesarias
import React, { useContext, useEffect, useState } from "react"; // Importaciones de React y hooks
import HomeBanner from "../../Components/HomeBanner/HomeBanner"; // Componente HomeBanner
import banner1 from '../../assets/images/banner1.png'; // Imágenes para los banners
import banner2 from '../../assets/images/banner2.png';
import { Carousel } from 'react-responsive-carousel'; // Componente de carrusel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Estilos para el carrusel
import ProductItem from "../../Components/ProductItem/ProductItem"; // Componente ProductItem
import HomeCat from "../../Components/HomeCat/HomeCat"; // Componente HomeCat
import banner3 from '../../assets/images/banner3.png';
import banner4 from '../../assets/images/banner4.png';
import { MyContext } from '../../MyContext/MyContext'; // Contexto de la aplicación
import { fetchDataFromApi } from "../../utils/api"; // Función para hacer fetch a la API
import Tabs from '@mui/material/Tabs'; // Componente de Tabs de Material UI
import Tab from '@mui/material/Tab'; // Componente de Tab de Material UI

// II. Definición del componente Home
const Home = () => {
    // II.a Definición de estados
    const [featuredProducts, setFeaturedProducts] = useState([]); // Estado para productos destacados
    const [productsData, setProductsData] = useState([]); // Estado para datos de productos
    const [selectedCat, setselectedCat] = useState(); // Estado para la categoría seleccionada
    const [filterData, setFilterData] = useState([]); // Estado para datos filtrados
    const [homeSlides, setHomeSlides] = useState([]); // Estado para las diapositivas de inicio
    const [value, setValue] = useState(0); // Estado para el valor de las Tabs
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar el dropdown

    // Uso del contexto
    const context = useContext(MyContext);



    // III. Funciones de manejo de eventos
    // Maneja el cambio de Tabs
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Selecciona la categoría
    const selectCat = (cat) => {
        setselectedCat(cat);
    };

    // Alterna el dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // IV. Efectos
    useEffect(() => {
        // Desplaza la ventana al inicio cuando se carga el componente
        window.scrollTo(0, 0);

        // Establece la categoría seleccionada como la primera de la lista
        if (context.categoryData && context.categoryData.length > 0) {
            setselectedCat(context.categoryData[0]?.name);
        }

        // Fetch de productos destacados
        fetchDataFromApi(`/api/products/featured`)
            .then((res) => {
                console.log(res);
                    setFeaturedProducts(res);
               
            })
            .catch((error) => {
                console.error('Error al obtener productos destacados', error);
            });

        // Fetch de productos
        fetchDataFromApi(`/api/products/pagina?page=1&perPage=8`)
            .then((res) => {
                    console.log(res);
                    setProductsData(res.products);
            })
            .catch((error) => {
                console.error('Error al obtener productos', error);
            });

        // Fetch de las diapositivas de inicio
        fetchDataFromApi(`/api/homeBanner`)
            .then((res) => {
                console.log(res);
                    setHomeSlides(res);
               
            })
            .catch((error) => {
                console.error('Error al obtener el homeBanner', error);
            });
    }, []);

    // Actualiza la categoría seleccionada cuando cambian los datos de categoría
    useEffect(() => {
        if (context.categoryData && context.categoryData.length > 0) {
            setselectedCat(context.categoryData[0].name);
        }
    }, [context.categoryData]);

    // Fetch de productos filtrados según la categoría seleccionada
    useEffect(() => {
        console.log(selectedCat);
        if (selectedCat) {
            fetchDataFromApi(`/api/products/categoria?catName=${selectedCat}`)
                .then((res) => {
                    console.log(res);
                        setFilterData(res.products);
                    
                })
                .catch((error) => {
                    console.error('Error al obtener productos filtrados', error);
                });
        }
    }, [selectedCat]);

    // V. Renderizado del componente
    return (
        <>
            {Array.isArray(homeSlides) && homeSlides.length > 0 && <HomeBanner data={homeSlides} />}
            {Array.isArray(context.categoryData) && context.categoryData.length > 0 && <HomeCat catData={context.categoryData} />}
            <section className="homeProducts">
                <div className="container">
                    <div className="row homeProductsRow">
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src={banner1} className="cursor w-100" alt="Banner 1" />
                                </div>
                                <div className="banner mt-4">
                                    <img src={banner2} className="cursor w-100" alt="Banner 2" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 productRow">
                            <div className="d-flex align-items-center res-flex-column">
                                <div className="info" style={{ width: "35%" }}>
                                    <h3 className="mb-0 hd">Productos Populares</h3>
                                    <p className="text-light text-sml mb-0">No te pierdas las ofertas más recientes</p>
                                </div>
                                <div className="ml-auto res-full" style={{ width: "65%" }}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        className="filterTabs"
                                    >
                                        {Array.isArray(context.categoryData) && context.categoryData.length > 0 && context.categoryData.map((item, index) => (
                                            <Tab className="item" label={item.name} onClick={() => selectCat(item.name)} key={index} />
                                        ))}
                                    </Tabs>
                                </div>
                            </div>
                            <div className="product_row w-100 mt-2">
                                <Carousel showArrows={true} showThumbs={false} infiniteLoop={true}>
                                    {Array.isArray(filterData) && filterData.length > 0 && filterData.slice(0).reverse().map((item, index) => (
                                        <div key={index}>
                                            <ProductItem item={item} />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                            <div className="d-flex mt-4 mb-3 bannerSec">
                                <div className="banner">
                                    <img src={banner3} className="cursor w-100" alt="Banner 3" />
                                </div>
                                <div className="banner">
                                    <img src={banner4} className="cursor w-100" alt="Banner 4" />
                                </div>
                                <div className="banner">
                                    <img src={banner4} className="cursor w-100" alt="Banner 4 duplicate" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center mt-3">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">Nuevos productos</h3>
                                    <p className="text-light text-sml mb-0">Los productos recientemente actualizados.</p>
                                </div>
                            </div>
                            <div className="product_row productRow2 w-100 mt-4 d-flex">
                                {Array.isArray(productsData) && productsData.length > 0 && productsData.slice(0).reverse().map((item, index) => (
                                    <ProductItem key={index} item={item} />
                                ))}
                            </div>
                            <div className="d-flex align-items-center mt-4">
                                <div className="info">
                                    <h3 className="mb-0 hd">Productos Destacados</h3>
                                    <p className="text-light text-sml mb-0">No te pierdas las ofertas de Julio</p>
                                </div>
                            </div>
                            <div className="product_row w-100 mt-2">
                                <Carousel showArrows={true} showThumbs={false} infiniteLoop={true}>
                                    {Array.isArray(featuredProducts) && featuredProducts.length > 0 && featuredProducts.slice(0).reverse().map((item, index) => (
                                        <div key={index}>
                                            <ProductItem item={item} />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home; // VI. Exportación del componente
