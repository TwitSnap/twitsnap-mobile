import AsyncStorage from '@react-native-async-storage/async-storage';
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Asegúrate de incluir el encabezado 'Accept'
};

const GetProfileHandler = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const authHeaders = {
            ...headers,
            'Authorization': `Bearer ${token}`, 
        };

        const response = await fetch(`${GATEWAY_URL}/api/v1/users/${userId}`, {
            method: 'GET',
            headers: authHeaders,
        });

        const responseJson = await response.json();
        console.log(responseJson);

        switch (response.status) {
            case 200: 
                return responseJson;
            default:
                throw new Error(responseJson.error || "Failed to fetch user profile.");
        }
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        throw error; 
    }
};

export default GetProfileHandler;