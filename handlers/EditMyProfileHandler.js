import AsyncStorage from '@react-native-async-storage/async-storage';
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const EditMyProfileHandler = async (username, phone, country, description) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error("User is not authenticated. No token found.");
        }

        const authHeaders = {
            ...headers,
            'Authorization': `Bearer ${token}`, 
        };

        const requestBody = {
            username,
            phone,
            country,
            description
        };

        const response = await fetch(`${GATEWAY_URL}/api/v1/users/me`, {
            method: 'PATCH',
            headers: authHeaders,
            body: JSON.stringify(requestBody),
        });

        const responseJson = await response.json();

        if (response.status === 200) {
            return responseJson; 
        } else if (response.status === 422) {
            throw new Error('Validation error: ' + JSON.stringify(responseJson.detail));
        } else {
            throw new Error(responseJson.error || "Failed to update user profile.");
        }
    } catch (error) {
        console.error("Error updating user profile: ", error);
        const message =
            error.response?.data?.error ||
            error.message ||
            'Service is not available at the moment';
        throw new Error(message);
    }
};

export default EditMyProfileHandler;