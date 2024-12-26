const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const socket = require('socket.io')
const server = http.createServer(app)
const io = socket(server)

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    })
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id)
    })
})

app.get("/", function (req, res) {
    res.render("index")
})
server.listen(3000);