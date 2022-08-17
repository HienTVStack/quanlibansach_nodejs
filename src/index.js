const express = require("express");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");
const route = require("./routes");
const db = require("./config/db");
const SortMiddleware = require("./app/middlewares/SortMiddleware");
const socket = require("socket.io");
const http = require("http");
const paypal = require('paypal-rest-sdk');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Connect DB
db.connect();
// Use view
app.use(express.static(path.join(__dirname, "public")));
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(methodOverride("_method"));
app.use(SortMiddleware);
//Message
const formatMessage = require("./../utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require("./../utils/users");

const botName = "ADMIN";
// Chatbot realtime
// Run when client connects
io.on("connection", (socket) => {
    socket.on("joinRoom", ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit("message", formatMessage(botName, "Xin chào! Chúng tôi có thể hổ trợ gì cho bạn"));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} tham gia chat`));

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} rời khỏi`));

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});
//End chatbot

//Paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AUqNLcdnyjopZmzLbT5JZQXWO9S8O1DdkcUG8JO97ivb2YB6-WQR0WVVj8-9Go1o3c6nxUXtvRURtWO5',
    'client_secret': 'ED6XjCpCc7Cph5pMdI2ImVqHkaN_BjiZvZ9J13b8qcgECxsVo9_Ah3tCX0HwHYQPjWtKVpGaBM5EkpRv'
});

//End paypal

// session
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: "somesecret",
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        },
    })
);
// Set views
const hbs = handlebars.create({
    extname: "hbs",
    helpers: {
        sum: (a, b) => a + b,
        subtraction: (a, b) => a - b,
        multip: (a, b) => a * b,
        sortable: (filed, sort) => {
            const sortType = filed === sort.column ? sort.type : "default";
            const icons = {
                default: "fa fa-sort",
                asc: "fa fa-sort-asc",
                desc: "fa fa-sort-desc",
            };
            const types = {
                default: "desc",
                asc: "desc",
                desc: "asc",
            };
            const icon = icons[sortType];
            const type = types[sortType];
            return `<a href="?_sort&column=${filed}&type=${type}">
                        <i class="${icon}" aria-hidden="true"></i>
                    </a>`;
        },
        for: function (from, to, incr, block) {
            var accum = "";
            for (var i = from; i < to; i += incr) accum += block.fn(i);
            return accum;
        },
        ifCond: function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
    },
});
app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.get('/ok', (req, res, next) => {
    var execute_payment_json = {
        'payer_id': req.query.PayerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": '1.00',
            }
        }]
    }
    paypal.payment.execute(req.query.paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response)
        } else {
            console.log(JSON.stringify(payment));
            //res.render('success');
            res.redirect('http://localhost:3000/danh-gia/san-pham-da-mua')
        }
    });
})


app.get("/api", (req, res, next) => {
    const Accounts = require("./app/models/accounts");

    Accounts.find({})
        .then(result => res.json(result))
})

route(app);

app.use((req, res, next) => {
    res.status(404).render("404/404", {
        layout: false
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:/${PORT}`);

    const Accounts = require("./app/models/accounts");
    

    Accounts.find({_id: require("mongoose").Types.ObjectId("626264a917e0cd84f806c1ac")}, {
            _id: 1,
            fullName: 1,
            email: 1,
            order: 1,
            cart: 1
        })
        .then(result => console.log(result[0].order))
});