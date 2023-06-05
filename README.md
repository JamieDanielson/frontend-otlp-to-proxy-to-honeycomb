in frontend dir, `npm i` and then `npm run build` and then `npm start`

in root dir, `export HONEYCOMB_API_KEY=<keyhere>` and then `docker-compose up --build`

in backend dir, `npm i` and then `npm start`

navigate to http://localhost:5000 in web browser and click Test.

Check the console for any possible errors, but otherwise should see it come into the collector and then into honeycomb
