# IoT based Energy Monitoring System using MERN stack and EMQX broker
I developed a MERN (MongoDB, Express.js, React.js, Node.js) stack application integrated with an EMQX broker to monitor residential energy consumption.
The application features an admin panel for managing devices and editing MQTT settings. Through MQTT subscriptions, data is relayed in real-time to the React web application while simultaneously being stored in a MongoDB collection.
In addition to live data visualization, the application uses analytical tools such as averaging algorithms to generate usage statistics at varying intervals - weekly, monthly, and hourly. This enables users to gain insights into consumption patterns.


![image](https://github.com/dasarathg68/energy-monitoring/assets/31665486/b73fab50-c375-4779-94c5-768861751bc8)
View usage statistics for all devices available

![image](https://github.com/dasarathg68/energy-monitoring/assets/31665486/71e56424-dbf0-43ed-8314-5408ded95267)
View monthly, hourly, weekly usage and live data for a device


![image](https://github.com/dasarathg68/energy-monitoring/assets/31665486/a3781ce7-a99b-472d-bdd2-c70f5e12aa12)
Admin Dashboard to manage devices, edit MQTT settings
