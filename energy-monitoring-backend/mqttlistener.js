const mqtt = require('mqtt');
const { payloadModel, settingsModel } = require('./db.js');
const mongoose = require('mongoose');

async function startMqttListener() {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    try {
        // Find MQTT connection details from the database
        const data = await settingsModel.findOne({ protocol: "mqtt" });
        if (!data) {
            throw new Error("MQTT connection details not found in database");
        }

        const { host, port, protocol,topic } = data;
        const connectUrl = `${protocol}://${host}:${port}`;
        const client = mqtt.connect(connectUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
        });

        client.on('connect', () => {
            console.log('Connected');
            client.subscribe(topic, () => {
                console.log(`Subscribed to topic ${topic}`);
            });
        });

        client.on('message', (topic, payload) => {
            // console.log('Received Message:', topic, payload.toString());
            try{
            payload = JSON.parse(payload.toString());
            let temp = topic.split("/");
            let deviceid = temp[2];
            // console.log("hi",temp[3])
            if(temp[3]!="isOnline"||temp[3]=="")
            {
            let { v, c, p, pf } = payload;
// Get current UTC time
          const utcTime = new Date();

          // Define the offset for IST (UTC+5:30)
          const offset = 5.5; // hours

          // Calculate the local time by adding the offset
          const time = new Date();

          // console.log(time);
            // c = p/v;
            const payloadObject = new payloadModel({
                voltage: v,
                current: c,
                power: p,
                powerfactor: pf,
                time: time,
                deviceid: deviceid
            });

            payloadObject.save().then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        }   }catch(error){
        
        }}
        
        );

    } catch (error) {
        console.error('Error retrieving MQTT connection details from the database:', error);
    }
}

module.exports = { startMqttListener };
