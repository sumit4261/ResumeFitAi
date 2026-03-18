require("dotenv").config()
const app = require('./src/app');
const ConnectToDB = require('./src/config/database');



ConnectToDB();



const PORT = 4040;

app.listen(PORT, ()=> {
    console.log(`Server is listing On ${PORT}`)
})

