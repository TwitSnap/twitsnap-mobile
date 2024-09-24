import {createContext, useContext, useState, useEffect } from "react";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const fetchedUser = {
                'id': '1234abc',
                'username': 'foobar2',
                'bio': 'Your short bio goes here.',
                'avatar': 'https://images.pexels.com/photos/1759530/pexels-photo-1759530.jpeg',
            };

            setLoggedInUser(fetchedUser);
        }

        fetchLoggedInUser();
    }, []);

    return (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
