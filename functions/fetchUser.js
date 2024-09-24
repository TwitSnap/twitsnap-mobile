export default async function fetchUser(userId) {
    try {
        const response = await fetch(`https://reqres.in/api/users/${userId}`);
        switch (response.status) {
            case 200:
                const responseJson = await response.json();
                return responseJson.data;
            default:
                return {};
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