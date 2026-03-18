# Deployment Fixes TODO

- [x] Edit Backend/src/controllers/auth.controller.js: Updated cookie options to conditional NODE_ENV for local/prod
- [x] Edit Frontend/src/features/auth/services/auth.api.js: Add await to register function  
- [x] Update Backend/.env CLIENT_URL to https://resume-fit-ai-nine.vercel.app (in .env.new - copy to Render dashboard)
- [ ] User: Set env vars in Render & Vercel dashboards
- [ ] git commit/push, test login & report generation
