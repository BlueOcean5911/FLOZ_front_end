import axios from "axios";
const BaseUrl = process.env.BASE_URL||'http://localhost:3005/';
const get = async (endpoint) => {
    try {
        return axios.get(`${BaseUrl}/${endpoint}`, {
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            return response.data;

        }).catch((error) => {
            console.log(error, 'error-------------');
            return error;

        });
    } catch (err) {
        return err;
    }
};
const post = async (endpoint, data) => {
    try {
        return axios.post(`${BaseUrl}/${endpoint}`, data).then((response) => {
            return response.data;

        }).catch((error) => {
            console.log(error, 'error-------------');
            return error;

        });
    } catch (err) {
        console.log(err);
        return err;
    }
};

export { get, post };