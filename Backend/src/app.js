const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();
app.set('trust proxy', 1);
const CLIENT_URL = process.env.CLIENT_URL

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://resume-fit-ai-beta.vercel.app",
  "https://resume-fit-axs26r52y-sumit4261s-projects.vercel.app"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true
}));

/* require all the routes here */ 
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

/*using all the routes here */
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

module.exports = app
