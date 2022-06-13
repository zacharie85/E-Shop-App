const express = require("express");
const mongose = require("mongoose");
const app =express();
const PORT = 3000;
require('dotenv/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const api = process.env.API_URL;
const MongoDBCOnnectionString = process.env.CONNECTION_STRING;
const morgan = require('morgan');
const ProductRouter = require("./routes/Product");
const UserRouter = require("./routes/Users");
const OrderRouter = require("./routes/Orders");
const CategoryRouter = require("./routes/Category");
const OrderItemsRouter = require("./routes/OrderItems");
const errorMiddleware = require("./middleware/error");
const AuthRouter = require('./routes/Auth');
const authJwt = require('./helpers/jwt');
//const AuthMiddleWare = require('./middleware/auth');
// before the app start
app.use(cors());
app.options('*',cors());

// middleware
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny')); // log les reponses du serveur
app.use(authJwt());

app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
// routes
app.use(`${api}/auth`,AuthRouter);
//app.use("*",AuthMiddleWare);
app.use(`${api}/users`,UserRouter)
app.use(`${api}/orders`,OrderRouter)
app.use(`${api}/categories`,CategoryRouter)
app.use(`${api}/orderItems`,OrderItemsRouter)
app.use(`${api}/products`,ProductRouter)

app.use(errorMiddleware);

mongose.connect(MongoDBCOnnectionString, { useNewUrlParser: true })
    .then(result => {
        console.log('connected to mongose');
        app.listen(PORT, () => {
            console.log('====================================');
            console.log("Server is listeneing on port " + PORT);
            console.log('====================================');
        })
    })
    .catch(err => {
        console.log('We have somme error ' + err)
    });

