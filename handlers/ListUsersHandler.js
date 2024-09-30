import AsyncStorage from '@react-native-async-storage/async-storage';
import { GATEWAY_URL } from '../constants';

const headers = {
    'Content-Type': 'application/json',
};

const ListUsersHandler = async () => {
    let allUsers = [];
    
    try {
        const token = await AsyncStorage.getItem('token');

        const authHeaders = {
            ...headers,
            'Authorization': `Bearer ${token}`, 
        };

        const response = await fetch(`${GATEWAY_URL}/api/v1/users/`, {
            method: 'GET',
            headers: authHeaders,
        });
   
        const datajson = await response.json(); 
        console.log(datajson);

        if (response.status === 200) {
            allUsers = datajson; 
            return allUsers;
        } else {
            throw new Error(datajson.error || "Failed to fetch users.");
        }
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error; 
    }
};

export default ListUsersHandler;