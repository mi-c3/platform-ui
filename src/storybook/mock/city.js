import cities from './cities.json';

const store = (() => cities.map((city, index) => ({ ...city, id: index + 1982 })))();
// record example:
// {
//   "id": 1982,
//   "country": "AD",
//   "name": "Sant Julià de Lòria",
//   "lat": "42.46372",
//   "lng": "1.49129"
// },

export const getCities = async (searchText = null) => {
    let response = store;
    if (searchText) {
        response = store.filter(
            ({ name, country }) =>
                name.toLowerCase().includes(searchText.toLowerCase()) || country.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    return response;
};
