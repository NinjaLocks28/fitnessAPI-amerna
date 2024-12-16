const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")


require('dotenv').config();

const userRoutes = require("./routes/user")
const workoutRoutes = require("./routes/workout")


const port = 4000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())    

const corsOptions = {
    origin: ['http://localhost:3000'],
    credential: true,
    optionsSuccessStatus: 200
}


app.use(cors(corsOptions));

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))



if(require.main === module){
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${port}`);
    })
}

module.exports = { app, mongoose };