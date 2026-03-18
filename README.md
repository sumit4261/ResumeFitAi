# ResumeFit AI

ResumeFit AI is a full-stack web app that helps users prepare for interviews by generating AI-powered interview strategy reports from a job description, resume, and/or self-description.

It includes:
- User authentication (register, login, logout, current user session)
- AI-generated interview report
- Technical questions with model answers
- Behavioral questions with STAR-style answers
- Skill gap analysis
- Day-wise preparation roadmap
- Interview report history and detail view
- Resume PDF parsing (upload) for richer context

## Demo Flow

1. Register or log in.
2. Paste a job description.
3. Upload a resume (PDF) or add a self-description.
4. Generate an interview strategy.
5. Review technical + behavioral questions, skill gaps, and roadmap.

## Tech Stack

### Frontend (`Frontend`)
- React 19
- Vite 8
- React Router 7
- Axios
- Sass

### Backend (`Backend`)
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + cookie-based auth
- Google GenAI SDK (`@google/genai`)
- Multer + pdf-parse
- Zod schema validation for structured AI output

## Project Structure

```text
ResumeFit AI/
|- Backend/
|  |- src/
|  |  |- config/
|  |  |- controllers/
|  |  |- middleware/
|  |  |- models/
|  |  |- routes/
|  |  |- services/
|  |- server.js
|  |- package.json
|- Frontend/
|  |- src/
|  |  |- features/
|  |  |  |- auth/
|  |  |  |- interview/
|  |  |- App.jsx
|  |  |- app.routes.jsx
|  |- package.json
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud)
- Google GenAI API key

## Environment Variables

Create a `.env` file inside `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

## Local Setup

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd "ResumeFit AI"

cd Backend
npm install

cd ../Frontend
npm install
```

### 2) Run backend

```bash
cd Backend
npm run dev
```

Backend runs on `http://localhost:4040`.

### 3) Run frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/get-me` (protected)

### Interview
- `POST /api/interview/` (protected, multipart form-data with optional `resume`)
- `GET /api/interview/` (protected)
- `GET /api/interview/report/:interviewId` (protected)
- `POST /api/interview/resume/pdf/:interviewReportId` (protected)

## Notes

- Auth uses cookies, so frontend requests include credentials.
- Current CORS origin is configured for `http://localhost:5173` in backend.
- Frontend API base URL is currently hardcoded to `http://localhost:4040`.

## Scripts

### Backend
- `npm run dev` - Start backend with nodemon

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview build locally
- `npm run lint` - Run ESLint

## Roadmap Ideas

- Add Docker and docker-compose setup
- Move frontend API URL to environment variables
- Add unit/integration tests
- Add CI pipeline (lint + build + tests)
- Improve error boundaries and loading states

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is currently unlicensed. Add a `LICENSE` file to define usage terms.
