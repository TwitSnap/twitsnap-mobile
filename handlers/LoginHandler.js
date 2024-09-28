import AsyncStorage from "@react-native-async-storage/async-storage";

const headers = {
    'Content-Type': 'application/json',
};

const LoginHandler = async (email, password) => {
    try {
        const requestBody = {
            email: email,
            password: password,
        };

        const response = await fetch('https://twitsnap-gateway.onrender.com/v1/auth/login', {
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
                const msg = `${responseJson.title || "Unknown Error"}\nStatus code: ${response.status}`;
                return new Error(msg);
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

export default LoginHandler;