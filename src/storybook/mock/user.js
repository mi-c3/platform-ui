const store = [
    { id: 123, login: 'luca', name: 'Luca' },
    { id: 124, login: 'denys', name: 'Denys' },
    { id: 125, login: 'gian', name: 'Giancarlo' },
    { id: 126, login: 'stany', name: 'Stanyslav' },
    { id: 127, login: 'stefan', name: 'Stefan Badenhorst' },
    { id: 128, login: 'rachel', name: 'Rachel' },
    { id: 129, login: 'mario', name: 'Mario' },
].map((u) => ({ ...u, image: `https://source.unsplash.com/collection/${u.id}/80x80` }));

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
