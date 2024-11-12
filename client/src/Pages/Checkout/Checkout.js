// I. Importación de módulos y componentes
import React, { useContext, useEffect, useState } from 'react'; // Importación de React y hooks
import TextField from '@mui/material/TextField'; // Importación del componente TextField de MUI
import Button from '@mui/material/Button'; // Importación del componente Button de MUI
import { IoBagCheckOutline } from "react-icons/io5"; // Importación del ícono IoBagCheckOutline de react-icons
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado
import { fetchDataFromApi, postData } from '../../utils/api'; // Importación de funciones para hacer llamadas a la API
import { useNavigate } from 'react-router-dom'; // Importación del hook useNavigate de react-router-dom

// II. Definición del componente Checkout
const Checkout = () => {
    // II.a Definición de estados para los campos del formulario y datos del carrito
    const [formFields, setFormFields] = useState({
        fullName: "",
        country: "",
        streetAddressLine1: "",
        streetAddressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: ""
    });

    const [cartData, setCartData] = useState([]); // Estado para los datos del carrito
    const [totalAmount, setTotalAmount] = useState(); // Estado para el monto total

    // III. useEffect para obtener datos del carrito al montar el componente
    useEffect(() => {
        window.scrollTo(0, 0); // Desplazar la ventana al inicio
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res);
            setTotalAmount(res.length !== 0 &&
                res.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0));
        });
    }, []);

    // IV. Manejar cambios en los campos del formulario
    const onChangeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    const context = useContext(MyContext); // Uso del contexto personalizado
    const history = useNavigate(); // Uso del hook useNavigate para la navegación

    // V. Manejar el proceso de checkout
    const checkout = (e) => {
        e.preventDefault();

        if (!validateFormFields()) return;

        const addressInfo = {
            name: formFields.fullName,
            phoneNumber: formFields.phoneNumber,
            address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
            pincode: formFields.zipCode,
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
        };

        var options = createPaymentOptions(addressInfo);

        var pay = new window.Razorpay(options);
        pay.open();
    };

    // VI. Validar campos del formulario
    const validateFormFields = () => {
        const requiredFields = ["fullName", "country", "streetAddressLine1", "streetAddressLine2", "city", "state", "zipCode", "phoneNumber", "email"];
        for (let field of requiredFields) {
            if (formFields[field] === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: `Please fill ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
                });
                return false;
            }
        }
        return true;
    };

    // VII. Crear opciones de pago
    const createPaymentOptions = (addressInfo) => ({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,     //debe de ser stripe
        key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
        amount: parseInt(totalAmount * 100),
        currency: "INR",
        order_receipt: 'order_rcptid_' + formFields.fullName,
        name: "E-Bharat",
        description: "for testing purpose",
        handler: function (response) {
            const paymentId = response.razorpay_payment_id;
            const user = JSON.parse(localStorage.getItem("user"));

            const payLoad = {
                name: addressInfo.name,
                phoneNumber: formFields.phoneNumber,
                address: addressInfo.address,
                pincode: addressInfo.pincode,
                amount: parseInt(totalAmount * 100),
                paymentId: paymentId,
                email: user.email,
                userid: user.userId,
                products: cartData
            };

            postData(`/api/orders/create`, payLoad).then(res => {
                history("/orders");
            });
        },
        theme: {
            color: "#3399cc"
        }
    });

    // VIII. Renderizado del componente
    return (
        <section className='section'>
            <div className='container'>
                <form className='checkoutForm' onSubmit={checkout}>
                    <div className='row'>
                        <div className='col-md-8'>
                            <h2 className='hd'>Detalles de la Faturación</h2>
                            <BillingDetailsForm onChangeInput={onChangeInput} />
                        </div>

                        <div className='col-md-4'>
                            <OrderSummary cartData={cartData} />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

// IX. Componentes auxiliares
const BillingDetailsForm = ({ onChangeInput }) => (
    <>
        <div className='row mt-3'>
            <div className='col-md-6'>
                <div className='form-group'>
                    <TextField label="Full Name *" variant="outlined" className='w-100' size="small" name="fullName" onChange={onChangeInput} />
                </div>
            </div>
            <div className='col-md-6'>
                <div className='form-group'>
                    <TextField label="Country *" variant="outlined" className='w-100' size="small" name="country" onChange={onChangeInput} />
                </div>
            </div>
        </div>
        <h6>Dirección/Calles*</h6>
        <div className='row'>
            <div className='col-md-12'>
                <div className='form-group'>
                    <TextField label="House number and street name" variant="outlined" className='w-100' size="small" name="streetAddressLine1" onChange={onChangeInput} />
                </div>
                <div className='form-group'>
                    <TextField label="Apartment, suite, unit, etc. (optional)" variant="outlined" className='w-100' size="small" name="streetAddressLine2" onChange={onChangeInput} />
                </div>
            </div>
        </div>
        <h6>Ciudad*</h6>
        <div className='row'>
            <div className='col-md-12'>
                <div className='form-group'>
                    <TextField label="City" variant="outlined" className='w-100' size="small" name="city" onChange={onChangeInput} />
                </div>
            </div>
        </div>
        <h6>País*</h6>
        <div className='row'>
            <div className='col-md-12'>
                <div className='form-group'>
                    <TextField label="State" variant="outlined" className='w-100' size="small" name="state" onChange={onChangeInput} />
                </div>
            </div>
        </div>
        <h6>Código Postal*</h6>
        <div className='row'>
            <div className='col-md-12'>
                <div className='form-group'>
                    <TextField label="ZIP Code" variant="outlined" className='w-100' size="small" name="zipCode" onChange={onChangeInput} />
                </div>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6'>
                <div className='form-group'>
                    <TextField label="Phone Number" variant="outlined" className='w-100' size="small" name="phoneNumber" onChange={onChangeInput} />
                </div>
            </div>
            <div className='col-md-6'>
                <div className='form-group'>
                    <TextField label="Email Address" variant="outlined" className='w-100' size="small" name="email" onChange={onChangeInput} />
                </div>
            </div>
        </div>
    </>
);

const OrderSummary = ({ cartData }) => (
    <div className='card orderInfo'>
        <h4 className='hd'>Tu orden</h4>
        <div className='table-responsive mt-3'>
            <table className='table table-borderless'>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cartData?.length !== 0 && cartData?.map((item, index) => (
                        <tr key={index}>
                            <td>{item?.productTitle?.substr(0, 20) + '...'}  <b>× {item?.quantity}</b></td>
                            <td>{item?.subTotal?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                        </tr>
                    ))}
                    <tr>
                        <td>Subtotal</td>
                        <td>{(cartData?.length !== 0 ? cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Button type="submit" className='btn-blue bg-red btn-lg btn-big'><IoBagCheckOutline /> &nbsp; Verificar</Button>
    </div>
);

export default Checkout; // Exportación del componente
