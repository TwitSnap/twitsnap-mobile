import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const RegisterHandler = async (
    username, email, password, phone, country
) => {
    try {
        const requestBody = {
            username: username,
            email: email,
            password: password,
            phone: phone,
            country: country
        };

        const response = await fetch(`${GATEWAY_URL}/api/v1/register/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        const responseJson = await response.json();
        console.log(responseJson);

        switch (response.status) {
            case 201: 
                return 0;
            case 422: 
                console.warn("Validation error: ", responseJson.detail);
                return new Error("Validation error: " + responseJson.detail.map(err => err.msg).join(', '));
            default:
                return new Error(responseJson.error || "Couldn't register the user.");
        }
    } catch (error) {
        console.error("error: ", error);
        const message =
            error.response?.data?.error ||
            error.message ||
            'Service is not available at the moment';
        throw new Error(message);
    }
};

export default RegisterHandler;