import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const VerifyPinHandler = async (user_id, pin) => {
    let retries = 0;
    const maxRetries = 5;  

    while (retries < maxRetries) {
        try {
            
            const response = await fetch(`${GATEWAY_URL}/api/v1/users/confirmation?user_id=${user_id}&pin=${pin}`, {
                method: 'POST',
                headers: headers,
            });

            console.log(response);

            switch (response.status) {
                case 204: 
                    return 0; 
                case 400:
                    throw new Error("Invalid request. Check the user_id or pin.");
                case 404:
                    throw new Error(response.message);
                default:
                    console.log(`Unexpected response status: ${response.status}. Retrying... attempt ${retries + 1}`);
                    retries++;
            }
        } catch (error) {
            console.log("Error verifying register pin: ", error);
            console.log(`Retrying... attempt ${retries + 1}`);

            retries++;

            if (retries >= maxRetries) {
                throw new Error("Maximum retry attempts reached. " + error.message);
            }
        }
    }
};

export default VerifyPinHandler;