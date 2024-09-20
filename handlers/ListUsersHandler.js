const ListUsersHandler = async () => {
    let allUsers = [];
    let totalPages = 1; 

    try {
        // Obtener la primera página para saber cuántas páginas hay
        const initialResponse = await fetch('https://reqres.in/api/users?page=1');
        const initialData = await initialResponse.json();
        totalPages = initialData.total_pages; 

        // Hacer fetch para cada página
        for (let page = 1; page <= totalPages; page++) {
            const response = await fetch(`https://reqres.in/api/users?page=${page}`);
            const data = await response.json();
            allUsers = allUsers.concat(data.data); 
        }

        return allUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
};

export default ListUsersHandler;