const mongooose = require("mongoose");
require('dotenv').config()

const dbFunc =async()=>{
    let con_string = process.env.CONNECTION_STRING

    // console.log("hi")
    await mongooose.connect
    (con_string).then(()=>{
        console.log("connection success");
    }).catch((err)=>{console.log(err)})
    
}
dbFunc();
const deviceModelSchema = new mongooose.Schema({
    deviceModelName: { type: String, unique: true },
});

const dbSchema1 = mongooose.Schema({
    deviceid: String,
    voltage: Number,
    current: Number,
    power: Number,
    powerfactor:Number,
    time:Date
})
const dbSchema2 = mongooose.Schema({
    protocol:String,
    host:String,
    port:String,
    topic:String,
    clientId:String,
})
const devicePrice = mongooose.Schema({
    deviceid:String,
    price:{
        type:Number,
        default:10
    }
})
const deviceModel = mongooose.model('DeviceModel', deviceModelSchema);
const payloadModel = mongooose.model('payload',dbSchema1)
const settingsModel =mongooose.model('settings',dbSchema2)
const devicePriceModel = mongooose.model('deviceprice',devicePrice)
module.exports = {deviceModel,payloadModel,settingsModel,devicePriceModel}