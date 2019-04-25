const store = [
    { id: 123, login: 'luca', name: 'Luca' },
    { id: 124, login: 'denys', name: 'Denys' },
    { id: 125, login: 'gian', name: 'Giancarlo' },
    { id: 1890, login: 'stany', name: 'Stanyslav' },
    { id: 1891, login: 'stefan', name: 'Stefan Badenhorst' },
    { id: 1892, login: 'rachel', name: 'Rachel' },
    { id: 1893, login: 'mario', name: 'Mario' },
];

export const getUsers = async (searchText = null) => {
    let users = store;
    if (searchText) {
        users = store.filter(
            ({ id, login, name }) =>
                String(id) === searchText ||
                login.toLowerCase().includes(searchText.toLowerCase()) ||
                name.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    return users;
};
