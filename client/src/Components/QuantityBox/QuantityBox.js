// I. Importación de módulos y componentes
import { FaMinus } from "react-icons/fa6"; // Importación del ícono FaMinus de react-icons
import { FaPlus } from "react-icons/fa6";  // Importación del ícono FaPlus de react-icons
import Button from '@mui/material/Button'; // Importación del componente Button de MUI
import { useContext, useEffect, useState } from "react"; // Importación de hooks de React
import { MyContext } from '../../MyContext/MyContext'; // Importación del contexto personalizado

// II. Definición del componente QuantityBox
const QuantityBox = (props) => {

    // II.a Estado local para manejar el valor del input
    const [inputVal, setInputVal] = useState(1);

    // II.b Uso del contexto personalizado
    const context = useContext(MyContext);

    // III. useEffect para actualizar el estado inicial del input
    useEffect(() => {
        if (props?.value !== undefined && props?.value !== null && props?.value !== "") {
            setInputVal(parseInt(props?.value)) // Si hay un valor inicial en props, lo establece en el estado
        }
    }, [props.value]);

    // IV. Función para disminuir la cantidad
    const minus = () => {
        if (inputVal !== 1 && inputVal > 0) {
            setInputVal(inputVal - 1); // Disminuye el valor del input en 1, asegurando que no sea menor a 1
        }
        context.setAlertBox({
            open:false,
        });
    };

    // V. Función para aumentar la cantidad
    const plus = () => {
        let stock = parseInt(props.item.countInStock); // Obtiene el stock del item desde props
        if(inputVal < stock){
            setInputVal(inputVal + 1); // Aumenta el valor del input en 1 si no supera el stock
        } else {
            context.setAlertBox({
                open:true,
                error:true,
                msg:"The quantity is greater than product count in stock" // Muestra una alerta si se intenta exceder el stock
            });
        }
    };

    // VI. useEffect para actualizar el valor de la cantidad seleccionada
    useEffect(() => {
        if (props.quantity) {
            props.quantity(inputVal); // Llama a la función de props para actualizar la cantidad
        }

        if (props.selectedItem) {
            props.selectedItem(props.item, inputVal); // Llama a la función de props para actualizar el item seleccionado
        }
    }, [inputVal]);

    // VII. Función para manejar cambios en el input directamente
    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0 && value <= props.item.countInStock) {
            setInputVal(value);
        }
    };

    // VIII. Renderizado del componente
    return (
        <div className='quantityDrop d-flex align-items-center'>
            <Button onClick={minus}><FaMinus /></Button> {/* Botón para disminuir la cantidad */}
            <input 
                type="text" 
                value={inputVal} 
                onChange={handleInputChange} // Añadido manejador onChange
            /> {/* Input para mostrar la cantidad */}
            <Button onClick={plus}><FaPlus /></Button> {/* Botón para aumentar la cantidad */}
        </div>
    );
}

export default QuantityBox; // Exportación del componente
