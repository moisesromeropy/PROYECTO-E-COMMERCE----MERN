import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Dashboard from './pages/Dashboard/indexDashboard';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import React, { createContext, useEffect, useState } from 'react';
import Login from './pages/Login/login';
import SignUp from './pages/SignUp/SignUp';
import Products from './pages/Products/indexProducts';
import Category from './pages/Category/categoryList';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import ProductUpload from './pages/Products/addProduct';
import EditProduct from './pages/Products/editProduct';
import CategoryAdd from "./pages/Category/addCategory";
import EditCategory from "./pages/Category/editCategory";
import SubCatAdd from "./pages/Category/addSubCat";
import SubCatList from "./pages/Category/subCategoryList";
import AddProductRAMS from "./pages/Products/addProductRAMS";
import ProductWeight from "./pages/Products/addProductWeight";
import ProductSize from './pages/Products/addProductSize';
import Orders from './pages/Orders/Orders';
import AddHomeBannerSlide from './pages/HomeBanner/addHomeSlide';
import HomeBannerSlideList from './pages/HomeBanner/homeSlideList';
import EditHomeBannerSlide from './pages/HomeBanner/editSlide';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar';
import { fetchDataFromApi } from './utils/api';
import axios from 'axios';

// I. Crear contexto MyContext
const MyContext = createContext();

function App() {
  // II. Definición de estados
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [catData, setCatData] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: ""
  });
  const [baseUrl] = useState("http://localhost:4000");
  const [progress, setProgress] = useState(0);
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');

  // III. Efecto para manejar el tema (light/dark)
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // IV. Efecto para manejar el login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  // V. Efecto para obtener la lista de países
  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data.data);
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({ open: false });
  };

  // VI. Efecto para obtener las categorías
  useEffect(() => {
    setProgress(20);
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    fetchDataFromApi('/api/category').then((res) => {
      setCatData(res);
      setProgress(100);
    });
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    setUser,
    user,
    countryList,
    selectedCountry,
    setselectedCountry
  };

  // VII. Renderización del componente
  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <LoadingBar
          color='#f11946'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className='topLoadingBar'
        />

        <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            autoHideDuration={6000}
            severity={alertBox.error === false ? "success" : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>

        {isHideSidebarAndHeader !== true && <Header />}
        <div className='main d-flex'>
          {isHideSidebarAndHeader !== true &&
            <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''}`}>
              <Sidebar />
            </div>
          }

          <div className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signUp" exact element={<SignUp />} />
              <Route path="/products" exact element={<Products />} />
              <Route path="/product/details/:id" exact element={<ProductDetails />} />
              <Route path="/product/upload" exact element={<ProductUpload />} />
              <Route path="/product/edit/:id" exact element={<EditProduct />} />
              <Route path="/category" exact element={<Category />} />
              <Route path="/category/add" exact element={<CategoryAdd />} />
              <Route path="/category/edit/:id" exact element={<EditCategory />} />
              <Route path="/subCategory/" exact element={<SubCatList />} />
              <Route path="/subCategory/add" exact element={<SubCatAdd />} />
              <Route path="/productRAMS/add" exact element={<AddProductRAMS />} />
              <Route path="/productWEIGHT/add" exact element={<ProductWeight />} />
              <Route path="/productSIZE/add" exact element={<ProductSize />} />
              <Route path="/orders/" exact element={<Orders />} />
              <Route path="/homeBannerSlide/add" exact element={<AddHomeBannerSlide />} />
              <Route path="/homeBannerSlide/list" exact element={<HomeBannerSlideList />} />
              <Route path="/homeBannerSlide/edit/:id" exact element={<EditHomeBannerSlide />} />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

// VIII. Exportar componente App y contexto MyContext
export default App;
export { MyContext };
