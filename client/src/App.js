// I. Importaciones necesarias
import "bootstrap/dist/css/bootstrap.min.css"; // Importación de estilos de Bootstrap
import "./App.css"; // Importación de estilos personalizados
import "./responsive.css"; // Importación de estilos responsivos
import { Route, Routes } from "react-router-dom"; // Importación de componentes de enrutamiento
import Home from "./Pages/Home/Home";
import Listing from "./Pages/Listing/Listing";
import ProductDetails from "./Pages/ProductDetails/ProductDetailsIndex";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import ProductModal from "./Components/ProductModal/ProductModal";
import Cart from "./Pages/Cart/Cart";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import MyList from "./Pages/MyList/MyList";
import Checkout from "./Pages/Checkout/Checkout";
import Orders from "./Pages/Orders/Orders";
import MyAccount from "./Pages/MyAccount/Myaccount";
import SearchPage from "./Pages/Search/Search";
import Snackbar from "@mui/material/Snackbar"; // Componente de notificación
import Alert from "@mui/material/Alert"; // Componente de alerta
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword"; // Importación de ForgotPassword
import ResetPassword from "./Pages/ResetPassword/ResetPassword"; // Importación de ResetPassword
import { MyProvider } from "./MyContext/MyContext"; // Importación del Proveedor de Contexto
import { useState } from "react"; // Importación de hooks



// II. Definición del componente App
function App() {
  // II.a. Definición de estados
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true); // Estado para controlar la visibilidad del header y footer
  const [productData, setProductData] = useState([]); // Estado para los datos del producto
  const [isOpenProductModal, setIsOpenProductModal] = useState(false); // Estado para controlar la apertura del modal de producto
  const [alertBox, setAlertBox] = useState({ // Estado para la caja de alerta
    msg: "",
    error: false,
    open: false,
  });

  // II.b. Función para cerrar la alerta
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertBox({ ...alertBox, open: false });
  };

  // III. Renderización del componente
  return (
    <MyProvider>
      {/* Componente Snackbar para mostrar alertas */}
      <Snackbar
        open={alertBox.open}
        autoHideDuration={6000}
        onClose={handleClose}
        className="snackbar"
      >
        <Alert
          onClose={handleClose}
          severity={alertBox.error === false ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertBox.msg}
        </Alert>
      </Snackbar>

      {/* Condicional para mostrar el header */}
      {isHeaderFooterShow && <Header />}

      {/* Definición de rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/category/:id" element={<Listing />} />
        <Route path="/products/subCat/:id" element={<Listing />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Ruta para ForgotPassword */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Ruta para ResetPassword */}
      </Routes>

      {/* Condicional para mostrar el footer */}
      {isHeaderFooterShow && <Footer />}

      {/* Condicional para mostrar el modal de producto */}
      {isOpenProductModal && <ProductModal data={productData} />}
    </MyProvider>
  );
}

// IV. Exportación del componente
export default App;
