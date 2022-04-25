import http from "http";
import express from "express";
import bodyParser from "body-parser";

import * as routes from "./routes";

const path = require('path');

import db from "./services/db";

import socketIo from "socket.io";


const PORT = 9000;
const app = express();


const router = express.Router();
for (let k in routes) {
    routes[k](router);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", router);
app.use(express.static(path.join(__dirname, "../public")));
app.all("*", (req, res) =>
  res.status(404).json({ error: `URL [${req.url}] not found` })
);

const server = http.createServer(app);

const io = socketIo(server)

//online user
let onlineUsers = {};
//current number of people online
let onlineCount = 0;

io.on('connection', socket => {

    //Listen for new users to join
    socket.on('login', async function (obj) {
        //Use the unique identifier of the newly added user as the name of the socket, which will be used later when exiting
        socket.name = obj.userid;

        //Check the online list and add it if it's not there
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //Online number +1
            onlineCount++;
        }
        await db.updateAccountOnlineStatus(obj.userid, true);

        // Broadcast user join to all clients
        io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});

    });

    socket.on('group-join',async function (obj) {
        // console.log(obj, 'user joined chat group');
        await db.joinGroup({account_id: obj.account_id, group_id: obj.group_id});
        await db.readMessage(obj.account_id,obj.group_id);
    });

    //listen to user exit
    socket.on('disconnect', async function () {
        //Remove the logged out user from the online list
        if (onlineUsers.hasOwnProperty(socket.name)) {
            //Log out of the user's information
            const obj = {userid: socket.name, username: onlineUsers[socket.name]};

            //delete
            delete onlineUsers[socket.name];
            //Number of people online -1
            onlineCount--;
            await db.updateAccountOnlineStatus(obj.userid, false);


            //Broadcast user exit to all clients
            io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});

        }
    });
//Listen to the chat content posted by the user
    socket.on('message', async function (obj) {
        // Broadcast the published message to all clients
        await db.addNewMessage({
            message: obj.content,
            groupId: (obj.group||{}).id,
            accountId: obj.userid,
        });
        io.emit('message', obj);

    });

    //listen to user typing message
    socket.on('user-typing', function (username) {
        // Broadcast the published message to all clients
        socket.broadcast.emit('typing', username);
    });

    socket.on('typing-abort', function (username) {
        // Broadcast the published message to all clients
        socket.broadcast.emit('typing-abort', username);
    });
})

server.listen(PORT, async (err) => {
    if (err) {
        return console.error("Server error: ", err);
    }
    const accounts = [{name: 'samuel aj'}, {name: 'daniel owusu'}, {name: 'Mikel Obi'}];
    const groups = [{name: 'React js'}, {name: 'Vue js'}, {name: 'Laravel (php)'}];
    let acc_ids = [];
    let grp_ids = [];

    for (const item of groups) {
        let grp = await db.createGroup(item)
        grp_ids.push(grp.id);
    }

    for (const item of accounts) {
        let acc = await db.createAccount(item);
        acc_ids.push(acc.id);
    }

    for (const item of acc_ids) {
        const random = Math.floor(Math.random() * grp_ids.length);
        await db.joinGroup({account_id: item, group_id: grp_ids[random]});
    }


    console.log(`Server is listening on ${PORT}`);
});
