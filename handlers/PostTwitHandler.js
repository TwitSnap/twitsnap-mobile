import AsyncStorage from "@react-native-async-storage/async-storage";
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const PostTwitHandler = async (body, tags) => {
    let retries = 0;
    const maxRetries = 5;  

    while (retries < maxRetries) {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error("User is not authenticated. No token found.");
            }

            const authHeaders = {
                ...headers,
                'Authorization': `Bearer ${token}`, 
            };

            const response = await fetch(`${GATEWAY_URL}/v1/twit`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    body,  // Cuerpo del twit
                    tags   // Array de tags
                }),
            });
            console.log(response);

            switch (response.status) {
                case 204: 
                    return 0;
                case 400:
                    throw new Error("Invalid request. Check the request body or parameters.");
                default:
                    console.log(`Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`);
                    retries++;
            }
        } catch (error) {
            console.error("Error posting twit: ", error);
            console.log(`Retrying... attempt ${retries + 1}`);

            retries++;

            if (retries >= maxRetries) {
                throw new Error("Maximum retry attempts reached. " + error.message);
            }
        }
    }
};

export default PostTwitHandler;