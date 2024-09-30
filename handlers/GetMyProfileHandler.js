import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const GetMyProfileHandler = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error("User is not authenticated. No token found.");
        }

        const authHeaders = {
            ...headers,
            'Authorization': `Bearer ${token}`, 
        };

        const response = await fetch(`${GATEWAY_URL}/api/v1/users/me`, {
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
        console.error("Error fetching user profile: ", error);
        const message =
            error.response?.data?.error ||
            error.message ||
            'Service is not available at the moment';
        throw new Error(message);
    }
};

export default GetMyProfileHandler;