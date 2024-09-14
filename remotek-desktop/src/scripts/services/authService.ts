const axios = require('axios');

export const login = async (email:string, password:string) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.API_URL}/auth/login`,
            data: {
                email,
                password
            }
        })
        return response.data;
    } catch (error:any) {
        console.log(error);
        return error.response.data;
    }
};

export const register = async (user: object) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${process.env.API_URL}/auth/register`,
            data: user
        })
        return response.data;
    } catch (error:any) {
        console.log(error);
        return error.response.data;
    }
};