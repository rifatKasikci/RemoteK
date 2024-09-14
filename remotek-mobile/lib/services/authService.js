import axios from 'axios';

export const signIn = async (email, password) => {
    try {
        console.log(process.env.EXPO_PUBLIC_API_URL);
        const response = await axios({
            method: 'post',
            url: `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
            data: {
                email,
                password,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.request);
        throw error;
    }
};

export const register = async (user) => {
    try {
        console.log(process.env.EXPO_PUBLIC_API_URL);
        const response = await axios({
            method: 'post',
            url: `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
            data: {
                ...user
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.request);
        throw error;
    }
}