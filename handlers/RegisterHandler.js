import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const RegisterHandler = async (
    username, email, password, phone, country
) => {
    try {
        const requestBody = {
            email: email,
            password: password,
        };

        // TODO: usar la API real
        const response = await fetch('https://reqres.in/api/register', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });
        const responseJson = await response.json();
        console.log(responseJson);

        switch (response.status) {
            case 200:
                const token = responseJson.token;
                await AsyncStorage.setItem('token', token);
                return 0;
            default:
                return Error(responseJson.error || "Couldn't register the user.");
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
