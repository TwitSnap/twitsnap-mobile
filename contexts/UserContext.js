import {createContext, useContext, useState, useEffect } from "react";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const initUserContext = async () => {
            const noUser = {
                'id': '',
                'username': 'unknown',
                'description': 'No bio available',
                'avatar': 'about:blank',
                'county': 'Country not specified',
            };

            setLoggedInUser(noUser);
        }

        initUserContext();
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
