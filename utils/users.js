const users = []

const addUser = ({ id,username,room }) => {
    console.log("socket id:",id);
    console.log("username/id:",username);
    console.log("room/request:",room);

    if (!id && !room) {
        return {
            error: 'Userid and room are required!'
        }
    }    const existingUser = users.find((user) => {
        return user.username === username
    })

    if (existingUser) {
        return {
            error: 'User with the same ID already exists!'
        }
    }

    const user = { id,username,room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}