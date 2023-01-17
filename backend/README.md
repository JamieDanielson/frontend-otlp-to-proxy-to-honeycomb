# api proxy backend

copy `.env.example` to `.env` and add api key

```bash
npm install
npm run dev
```

see if it's accessible from the frontend app:

`curl -i http://localhost:3000/v1/traces -H "Origin: http://localhost:5000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: X-Requested-With" -H "Content-Type: application/json" -X OPTIONS`
