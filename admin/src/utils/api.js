import axios from "axios";

const token=localStorage.getItem("token");

const params={
    headers: {
        'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
        'Content-Type': 'application/json', // Adjust the content type as needed
      },

} 

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url,params)
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}


export const uploadImage = async (url, formData) => {

    const { res } = await axios.post(process.env.REACT_APP_BASE_URL + url , formData)
    return res;
}

export const postData = async (url, formData) => {
    try {
        // Define the base URL from environment variables
        const baseUrl = process.env.REACT_APP_BASE_URL;

        // Create the full URL
        const fullUrl = `${baseUrl}${url}`;

        // Make the POST request using axios
        const response = await axios.post(fullUrl, formData, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
                'Content-Type': 'application/json', // Adjust the content type as needed
            }
        });

        // Return the response data
        return response.data;

    } catch (error) {
        // Handle errors
        console.error('Error:', error.response ? error.response.data : error.message);
        // Optionally return the error data or rethrow the error
        return error.response ? error.response.data : { error: error.message };
    }
};

export const postData2 = async (url, formData) => {
    try {
        // Define the base URL from environment variables
        const baseUrl = process.env.REACT_APP_BASE_URL;

        // Create the full URL
        const fullUrl = `${baseUrl}${url}`;

        // Make the POST request using axios
        const response = await axios.post(fullUrl, formData, {
            headers: {
                'Content-Type': 'application/json', // Adjust the content type as needed
            }
        });

        // Return the response data
        return response.data;

    } catch (error) {
        // Handle errors
        console.error('Error:', error.response ? error.response.data : error.message);
        // Optionally return the error data or rethrow the error
        return error.response ? error.response.data : { error: error.message };
    }
};

export const editData = async (url, updatedData ) => {
    const { res } = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`,updatedData, {
        headers: {
            'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
            'Content-Type': 'application/json', // Adjust the content type as needed
        }
    })
    return res;
}

export const deleteData = async (url ) => {
    const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`,params)
    return res;
}


export const deleteImages = async (url,image ) => {
    const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`,image);
    return res;
}