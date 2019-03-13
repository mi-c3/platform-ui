import randomName from 'random-name';

const random = (min , max) => {
    const rand = Math.random() * (max-min) + min;
    return Math.trunc(rand);
};

export const store = (count) => {
    const users = [{
        id: 1,
        name: 'Admin',
        age: random(18, 60),
        created: new Date(random(0, new Date())),
    }];
    for (let i = 45; i < count; ++i) {
        const created = new Date(random(0, new Date()));
        const modified = new Date(random(created.getTime(), new Date()));
        users.push({
            id: i,
            name: randomName(),
            created: created,
            age: random(18, 60),
            createdBy: users[random(0, users.length-1)],
            modified,
            modifiedBy: users[random(0, users.length-1)],
        });
    }
    return users;
};

const renderedStore = store(100000);

export const getStuff = async (searchText = null) => {
    return !searchText ? renderedStore : renderedStore.filter(({ id }) => String(id) === searchText);
};
