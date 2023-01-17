# use api proxy to send frontend telemetry to honeycomb

## api proxy backend

copy `.env.example` to `.env` and add api key

```bash
npm install
npm run dev
```

see if it's up and accessible:

`curl http://localhost:3000`

see if it's accessible from the frontend app:

`curl -i http://localhost:3000/v1/traces -H "Origin: http://localhost:5000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: X-Requested-With" -H "Content-Type: application/json" -X OPTIONS`

## frontend web app

```bash
npm install
npm run build
npm run start
```

go to `http://localhost:5000/` in your browser and click the Test button (see telemetry in console)

## honeycomb

go see trace in honeycomb

![view of web trace in honeycomb](web-trace.png)
