// I. Importación de módulos y funciones
import React, { createContext, useState, useEffect } from 'react'; // Importación de React y hooks
import { fetchDataFromApi, postData } from '../utils/api'; // Importación de funciones para hacer llamadas a la API

// II. Creación del contexto
export const MyContext = createContext();

// III. Proveedor del contexto
export const MyProvider = ({ children }) => {
  // III.a Definición de estados
  const [selectedCountry, setSelectedCountry] = useState(""); // Estado para el país seleccionado
  const [isOpenProductModal, setIsOpenProductModal] = useState(false); // Estado para controlar la apertura del modal de producto
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true); // Estado para controlar la visibilidad del header y footer
  const [isLogin, setIsLogin] = useState(false); // Estado para controlar si el usuario está logueado
  const [categoryData, setCategoryData] = useState([]); // Estado para los datos de las categorías
  const [subCategoryData, setSubCategoryData] = useState([]); // Estado para los datos de las subcategorías
  const [addingInCart, setAddingInCart] = useState(false); // Estado para controlar si se está añadiendo al carrito
  const [cartData, setCartData] = useState([]); // Estado para los datos del carrito
  const [searchData, setSearchData] = useState([]); // Estado para los datos de búsqueda
  const [isOpenNav, setIsOpenNav] = useState(false); // Estado para controlar la apertura de la navegación
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Estado para el ancho de la ventana
  const [alertBox, setAlertBox] = useState({ // Estado para la caja de alerta
    msg: "",
    error: false,
    open: false,
  });
  const [user, setUser] = useState(null); // Estado para los datos del usuario

  // Estados para la paginación
  const [page, setPage] = useState(1); // Estado para la página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas

  // IV. Obtener datos del carrito del usuario
  const getCartData = () => {
    const user = JSON.parse(localStorage.getItem("user")); // Obtiene los datos del usuario del localStorage
    if (user) {
      fetchDataFromApi(`/api/cart?userId=${user.id}`).then((res) => {
        if (res) {
          setCartData(res); // Actualiza el estado con los datos del carrito
        } else {
          console.error('No data found in response'); // Maneja el caso de no encontrar datos
        }
      }).catch((error) => {
        console.error('Error fetching cart data:', error); // Maneja errores en la llamada a la API
      });
    }
  };

  // V. Verificar el estado de autenticación del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage
    if (token) {
      setIsLogin(true); // Si hay token, establece el estado de login a verdadero
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData); // Establece los datos del usuario
    } else {
      setIsLogin(false); // Si no hay token, establece el estado de login a falso
    }
  }, []);

  // VI. Abrir modal de detalles del producto
  const openProductDetailsModal = (id, status) => {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      if (res) {
        setIsOpenProductModal(status); // Establece el estado para abrir el modal del producto
      } else {
        console.error('No data found in response'); // Maneja el caso de no encontrar datos
      }
    }).catch((error) => {
      console.error('Error fetching product data:', error); // Maneja errores en la llamada a la API
    });
  };

  // VII. Cerrar notificación de alerta
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertBox({ open: false }); // Cierra la alerta
  };

  // VIII. Añadir producto al carrito
  const addToCart = (data) => {
    if (isLogin) {
      setAddingInCart(true); // Establece el estado de añadiendo al carrito a verdadero
      postData(`/api/cart/add`, data).then((res) => {
        if (res && res.status !== false) {
          setAlertBox({
            open: true,
            error: false,
            msg: "Item is added in the cart",
          });

          setTimeout(() => {
            setAddingInCart(false);
          }, 1000);

          getCartData(); // Actualiza los datos del carrito
        } else {
          setAlertBox({
            open: true,
            error: true,
            msg: res?.msg || 'Error adding item to cart',
          });
          setAddingInCart(false); // Establece el estado de añadiendo al carrito a falso
        }
      }).catch((error) => {
        console.error('Error adding item to cart:', error); // Maneja errores en la llamada a la API
        setAddingInCart(false); // Establece el estado de añadiendo al carrito a falso
      });
    } else {
      setAlertBox({
        open: true,
        error: true,
        msg: "Please login first",
      });
    }
  };

  // IX. Obtener lista de países y categorías al montar el componente
  useEffect(() => {
    fetchDataFromApi(`/api/category`).then((res) => {
      if (res) {
        setCategoryData(res.categoryList); // Actualiza el estado con los datos de las categorías
      } else {
        console.error('No data found in response'); // Maneja el caso de no encontrar datos
      }
    }).catch((error) => {
      console.error('Error fetching category data:', error); // Maneja errores en la llamada a la API
    });

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userId) {
      fetchDataFromApi(`/api/cart?userId=${user.id}`).then((res) => {
        if (res) {
          setCartData(res); // Actualiza el estado con los datos del carrito
        } else {
          console.error('No data found in response'); // Maneja el caso de no encontrar datos
        }
      }).catch((error) => {
        console.error('Error fetching cart data:', error); // Maneja errores en la llamada a la API
      });
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth); // Actualiza el estado del ancho de la ventana
    };

    const location = localStorage.getItem("location");
    if (location) {
      setSelectedCountry(location); // Establece el país seleccionado desde el localStorage
    } else {
      setSelectedCountry("All");
      localStorage.setItem("location", "All");
    }

    window.addEventListener("resize", handleResize); // Añade un evento para manejar el redimensionamiento de la ventana

    return () => {
      window.removeEventListener("resize", handleResize); // Limpia el evento al desmontar el componente
    };
  }, []);

  // X. Definición de valores del contexto
  const values = {
    setSelectedCountry,
    selectedCountry,
    isOpenProductModal,
    setIsOpenProductModal,
    isHeaderFooterShow,
    setIsHeaderFooterShow,
    isLogin,
    setIsLogin,
    user,
    setUser,
    categoryData,
    setCategoryData,
    subCategoryData,
    setSubCategoryData,
    openProductDetailsModal,
    alertBox,
    setAlertBox,
    addToCart,
    addingInCart,
    setAddingInCart,
    cartData,
    setCartData,
    getCartData,
    searchData,
    setSearchData,
    windowWidth,
    isOpenNav,
    setIsOpenNav,
    page,
    setPage,
    totalPages,
    setTotalPages,
    handleClose,
  };

  // XI. Renderizar proveedor del contexto
  return (
    <MyContext.Provider value={values}>
      {children}
    </MyContext.Provider>
  );
};
