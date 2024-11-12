// I. Importaciones necesarias
import React, { useState } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { HiDotsVertical } from "react-icons/hi";
import { IoIosTimer } from "react-icons/io";

// II. Definición del Componente DashboardBox
const DashboardBox = (props) => {
    // III. Definición de los Estados
    const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar el menú
    const open = Boolean(anchorEl); // Verifica si el menú está abierto

    const ITEM_HEIGHT = 48; // Altura del ítem del menú

    // IV. Funciones para manejar la apertura y cierre del menú
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // Abre el menú
    };
    const handleClose = () => {
        setAnchorEl(null); // Cierra el menú
    };

    // V. Renderizado del Componente
    return (
        <Button className="dashboardBox" style={{
            backgroundImage:
                `linear-gradient(to right, ${props.color?.[0]} , ${props.color?.[1]})`
        }}>
            {/* VI. Indicador de Crecimiento o Disminución */}
            {
                props.grow === true ?
                    <span className="chart"><TrendingUpIcon /></span>
                    :
                    <span className="chart"><TrendingDownIcon /></span>
            }

            {/* VII. Contenido del DashboardBox */}
            <div className="d-flex w-100">
                <div className="col1">
                    <h4 className="text-white mb-0">{props.title}</h4>
                    <span className="text-white">{props.count > 0 ? props.count : 0}</span>
                </div>

                <div className="ml-auto">
                    {
                        props.icon ?
                            <span className="icon">
                                {props.icon ? props.icon : ''}
                            </span>
                            :
                            ''
                    }
                </div>
            </div>

            {/* VIII. Menú de Opciones */}
            <div className="menu">
                <HiDotsVertical onClick={handleClick} />
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    <MenuItem onClick={handleClose}><IoIosTimer /> Timer</MenuItem>
                    <MenuItem onClick={handleClose}><TrendingUpIcon /> Incrementar</MenuItem>
                    <MenuItem onClick={handleClose}><TrendingDownIcon /> Decrementar</MenuItem>
                </Menu>
            </div>
        </Button>
    );
}

// IX. Exportación del Componente
export default DashboardBox;
