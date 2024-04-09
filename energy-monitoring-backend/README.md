# Getting Started
This application is built using the React library and requires Node.js and npm (Node Package Manager) installed in your server/desktop computer.
Installation:

1. https://nodejs.org/en
2. Check installation - ```node -v```
3. Update npm installation - ```sudo npm install npm --global```

## Frontend (energy-monitoring-dashboard)
This command installs all the dependencies required to run the frontend application (run all of these after navigating to the root directory(energy-monitoring-dashboard))
```plaintext
npm install
```
This command starts the shell script and associates it with PM2 (process manager)
```plaintext
pm2 start dashboard.sh
```
To view the status of the processes running
```plaintext
pm2 list 
```
The structure of the project:

1. styles - contains all the css modules
2. pages - this web app has four pages: Admin, Dashboard, Login and Individual Devices
3. utils - utilities like PrivateRoutes & config details (API endpoint) for reference and config.json file contains details for the API endpoint called to the backend
4. components - individual blocks used in the page


## Backend (energy-monitoring-backend)
This command installs all the dependencies required to run the backend application (run all of these after navigating to the root directory(energy-monitoring-backend))
```plaintext
npm install
```
To launch your application in a production setting, use:
```plaintext
pm2 start --name 'energy-monitoring-backend' index.js
```
To view the status of the processes running
```plaintext
pm2 list 
```
1. The .env file contains information about the connection string in MongoDb.
2. The index.js contains all the APIs and their associated functions.
3. mqttlistener.js function establishes connection to the MQTT broker
4. db.js defines the mongoose schema for the collections 
