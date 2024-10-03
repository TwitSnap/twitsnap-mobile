import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const RegisterHandler = async (
    username, email, password, phone, country
) => {
    const requestBody = {
        username: username,
        email: email,
        password: password,
        phone: phone,
        country: country
    };

    let retries = 0;
    const maxRetries = 5;  

    while (retries < maxRetries) {
        try {
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
                    return new Error("Validation error: " + responseJson.detail.map(err => err.msg).join(', '));
                default:
                    console.log(`Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`);
                    retries++;
            }

        } catch (error) {
            console.error("Error encountered: ", error);
            console.log(`Retrying... attempt ${retries + 1}`);

            retries++;
r
            if (retries >= maxRetries) {
                throw new Error("Maximum retry attempts reached. ");
            }
        }
    }
};

export default RegisterHandler;