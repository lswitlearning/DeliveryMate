const express = require('express')
const { logErrors, errorHandler } = require('./utils/errorHandler.js')
const userRoutes = require('./routes/user.routes.js');
const deliveryRoutes = require('./routes/deliveryRequest.routes.js');
const acceptedRequest = require('./routes/acceptedRequest.routes.js');
const notificationRequest = require('./routes/notification.routes.js');
const authenticateToken = require('./utils/authenticateToken.js')
const path = require('path');
//const app = express()
// for chat system
const socketio = require('socket.io')
const http = require('http')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

//const server = http.createServer(app)
//const io = socketio(server)

async function getUserInfo() {
    const userToken = localStorage.getItem('token');

    try {
        const response = await fetch('/api/user/currentuser', {
            headers: {
                'Authorization': userToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const responseData = await response.json();
        console.log(responseData)

        return responseData;
    }
    catch (error) {
        console.log("Error:".error);
    }
}

const port = 3000 || process.env.port

//database connection
require('./utils/dbConnection')
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads')); // Serve images from the uploads directory

// socket stuff

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    console.log('Connected to Socket.IO');

    socket.on('join', (options, callback) => {
        console.log("username",options.username);
        console.log("room",options.room);
        const { error, user } = addUser({ id: socket.id,username:options.username,room:options.room });

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
});

//frontend routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/signup.html'));
})
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/requestboard.html'));
})
app.get('/new-request', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/createrequest.html'));
})
app.get('/forget-password', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/forget-password/forget-password.html'));
})
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/reset-password/reset-password.html'));
})
app.get('/chat', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/chat.html'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/request-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/requestManagement/requestManagement.html'));
});
app.get('/request-management/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/requestById/requestById.html'));
});
app.get('/account-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/accountManagement/accountManagement.html'));
});
app.get('/accepted-request', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/acceptedRequest/acceptedRequest.html'));
});
app.get('/notification', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/notification/notification.html'));
});

// Serve the socket.io.js file without strict MIME type checking
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'node_modules', 'socket.io', 'dist', 'socket.io.js'), {
        headers: {
            'Content-Type': 'application/javascript', // Set the appropriate content type
        },
    });
});


//backend routes
app.use('/api/user', userRoutes)
app.use('/api/delivery', authenticateToken, deliveryRoutes)
app.use('/api/accepetedRequest', authenticateToken, acceptedRequest)
app.use('/api/notification', authenticateToken, notificationRequest)


//error handling
app.use(logErrors)
app.use(errorHandler)

server.listen(port, () => {
    console.log(`litening st ${port}`)
})