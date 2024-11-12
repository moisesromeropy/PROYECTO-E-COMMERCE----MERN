import Button from '@mui/material/Button';
import { IoIosSearch } from "react-icons/io";
import { fetchDataFromApi } from '../../../utils/api';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../../MyContext/MyContext';

import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const SearchBox = (props) => {

    const [searchFields, setSearchFields] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);

    const history = useNavigate();

    const onChangeValue = (e) => {
        setSearchFields(e.target.value);
    }


    const searchProducts = () => {
        if(searchFields!==""){
            setIsLoading(true);
            fetchDataFromApi(`/api/search?q=${searchFields}`).then((res) => {
                context.setSearchData(res);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                props.closeSearch();
                history("/search");
            })
        }
   
    }

    return (
        <div className='headerSearch ml-3 mr-3'>
            <input type='text' placeholder='Buscar por producto...' onChange={onChangeValue} />
            <Button onClick={searchProducts}>
                {
                    isLoading === true ? <CircularProgress /> : <IoIosSearch />
                }


            </Button>
        </div>
    )
}

export default SearchBox;