import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const sendShutdownRemoteCommand = async () => {
    try {
        const token = await SecureStore.getItem('userToken');
        if (!token) {
            throw new Error('Token not found');
        }

        const response = await axios({
            method: 'post',
            url: `${process.env.EXPO_PUBLIC_API_URL}/remote-command/shutdown`,
            headers: { 'authorization': `Bearer ${token}` }
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.request);
        console.log(error.response?.data);
        console.log(error);
        throw error;
    }
};