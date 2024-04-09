const express = require("express");
const cors = require("cors");
const mongooose = require("mongoose");

const moment = require("moment");

const axios = require("axios");
const app = express();
const {
  deviceModel,
  payloadModel,
  settingsModel,
  devicePriceModel,
} = require("./db");
const { startMqttListener } = require("./mqttlistener");
const port = 3001;
app.use(cors());
app.use(express.json());

startMqttListener();
app.get("/getSettings", async (req, res) => {
  let { host, protocol, port, topic } = await settingsModel
    .findOne({ protocol: "mqtt" })
    .catch((err) => res.status(500).json(err));
  res.json({ host, protocol, port, topic }).status(200);
});
app.put("/updateSettings", async (req, res) => {
  try {
    let host = req.body.host;
    let protocol = req.body.protocol;
    let port = req.body.port;
    let topic = req.body.topic;

    await settingsModel.updateOne(
      { protocol: "mqtt" },
      { protocol, host, port, topic }
    );

    res.status(200).json({ message: "Updated Successfully" });

    await startMqttListener();
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ message: "Error updating" });
  }
});

app.get("/getmodelslist", async (req, res) => {
  try {
    const models = await deviceModel.find({}, { _id: 0, deviceModelName: 1 });

    res.status(200).json(models);
  } catch (error) {
    console.error("Error fetching device models:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.delete("/deletemodel/:deviceNameDelete", async (req, res) => {
  try {
    const devicename = req.params.deviceNameDelete;
    if (!devicename) {
      return res.status(400).json({ message: "Device name is required" });
    }

    const result = await deviceModel.deleteOne({ deviceModelName: devicename });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Device model not found" });
    }

    res.status(200).json({ message: "Device model removed successfully" });
  } catch (error) {
    console.error("Error deleting device model:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});
app.get("/device", async (req, res) => {
  let deviceid = req.headers.deviceid;
  let token = req.headers.token;
  try {
    axios
      .get("http://<serverurl>:5000/device_models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (data) => {
        let apires = data.data.devices;

        let deviceData = apires.find((device) => device.device_id === deviceid);

        res.json(deviceData).status(200);
      });
  } catch (error) {
    res.json(error).status(500);
  }
});
app.post("/devicelatest", async (req, res) => {
  try {
    let deviceIds = req.body;
    if (typeof deviceIds === "string") {
      deviceIds = deviceIds.split(",").map((deviceid) => deviceid.trim());
    } else if (Array.isArray(deviceIds)) {
      deviceIds = deviceIds.map((deviceid) => deviceid.trim());
    } else {
      throw new Error("Invalid deviceids format");
    }

    const latestDataPromises = deviceIds.map((deviceid) => {
      return payloadModel
        .findOne({ deviceid: deviceid })
        .sort({ time: -1 })
        .lean();
    });

    const latestData = await Promise.all(latestDataPromises);

    const responseData = latestData.filter((data) => data !== null);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/usagehistory", async (req, res) => {
  const devicenames = req.body;
  let token = req.headers.token;

  if (devicenames) {
    try {
      // Get the start and end date of the last week
      const startDate = moment().subtract(7, "days").startOf("day");
      const endDate = moment().subtract(0, "days").endOf("day");

      // Query to get total power usage in the last week each day
      const powerUsageLastWeek = await payloadModel.aggregate([
        {
          $match: {
            time: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            deviceid: { $in: devicenames },
          },
        },
        {
          $group: {
            _id: {
              deviceid: "$deviceid",
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$time",
                  timezone: "Asia/Kolkata",
                },
              },
              hour: { $hour: { $toDate: { $subtract: ["$time", 19800000] } } },
            },
            averagePower: { $avg: "$power" },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            totalPower: { $sum: "$averagePower" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      // Query to get top 5 devices last week
      const startDateWeek = moment().startOf("week");
      const endDateWeek = moment().endOf("week");
      const topDevicesLastWeek = await payloadModel.aggregate([
        {
          $match: {
            time: { $gte: startDateWeek.toDate(), $lte: endDateWeek.toDate() },
            deviceid: { $in: devicenames },
          },
        },
        {
          $group: {
            _id: {
              deviceid: "$deviceid",
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$time",
                  timezone: "Asia/Kolkata",
                },
              },
              hour: { $hour: { $toDate: { $subtract: ["$time", 19800000] } } },
            },
            averagePower: { $avg: "$power" },
          },
        },
        {
          $group: {
            _id: "$_id.deviceid",
            totalPower: { $sum: "$averagePower" },
          },
        },
        {
          $sort: { totalPower: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      const datesInRange = Array.from({ length: 7 }, (_, i) =>
        moment(endDate).subtract(i, "days").format("YYYY-MM-DD")
      );
      const processedPowerUsage = datesInRange.map((date) => {
        const powerUsage = powerUsageLastWeek.find(
          (entry) => entry._id === date
        );

        return {
          date,
          totalPower: powerUsage ? powerUsage.totalPower / 1000 : 0,
        };
      });
      console.log(powerUsageLastWeek);
      const startDateMonth = moment().startOf("month"); // Start of current month
      const endDateMonth = moment().endOf("month"); // End of current month

      const powerUsagePerDevicePerDay = await payloadModel.aggregate([
        {
          $match: {
            time: {
              $gte: startDateMonth.toDate(),
              $lte: endDateMonth.toDate(),
            },
            deviceid: { $in: devicenames },
          },
        },
        {
          $group: {
            _id: {
              deviceid: "$deviceid",
              hour: { $hour: { $toDate: { $subtract: ["$time", 19800000] } } },
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$time",
                  timezone: "Asia/Kolkata",
                },
              }, // Format day as YYYY-MM-DD
            },
            averagePower: { $avg: "$power" },
          },
        },
        {
          $group: {
            _id: { deviceid: "$_id.deviceid", day: "$_id.day" },
            totalPower: { $sum: "$averagePower" },
          },
        },
        {
          $sort: { "_id.day": 1, "_id.deviceid": 1 },
        },
      ]);

      let powerUsagePerDevicePerDayFormatted = [];

      // Group the data by deviceid
      const groupedData = powerUsagePerDevicePerDay.reduce((acc, entry) => {
        const dateKey = entry._id.day; // Using _id.day instead of entry.time
        if (!acc[entry._id.deviceid]) {
          acc[entry._id.deviceid] = Array.from({
            length: moment().daysInMonth(),
          }).fill(0); // Initialize data array for each device for the current month
        }
        const index = moment(dateKey).date() - 1;
        acc[entry._id.deviceid][index] += entry.totalPower / 1000;
        return acc;
      }, {});

      // Convert the grouped data into the desired format
      Object.keys(groupedData).forEach((deviceid) => {
        powerUsagePerDevicePerDayFormatted.push({
          name: deviceid,
          data: groupedData[deviceid],
        });
      });

      let CurrentMonthPowTotal = 0;
      powerUsagePerDevicePerDay.map((power) => {
        CurrentMonthPowTotal += power.totalPower;
      });
      const startDateToday = moment().startOf("day");
      const endDateToday = moment().endOf("day");

      const powerUsageTodayHourly = await payloadModel.aggregate([
        {
          $match: {
            time: {
              $gte: startDateToday.toDate(),
              $lte: endDateToday.toDate(),
            },
            deviceid: { $in: devicenames },
          },
        },
        {
          $addFields: {
            hourOfDay: { $hour: { date: "$time", timezone: "Asia/Kolkata" } }, // Extract hour of the day in IST
          },
        },
        {
          $group: {
            _id: { deviceid: "$deviceid", hourOfDay: "$hourOfDay" },
            totalPower: { $avg: "$power" },
          },
        },
        {
          $project: {
            _id: 0, // Exclude _id field
            deviceid: "$_id.deviceid",
            hourOfDay: "$_id.hourOfDay",
            totalPower: 1,
          },
        },
        {
          $sort: { hourOfDay: 1 },
        },
      ]);
      let groupedHourlyData = [];

      powerUsageTodayHourly.forEach((data) => {
        let { totalPower, deviceid, hourOfDay } = data;
        totalPower /= 1000;
        const existingDevice = groupedHourlyData.find(
          (entry) => entry.name === deviceid
        );

        if (existingDevice) {
          existingDevice.data[hourOfDay] = totalPower;
        } else {
          const newDataPoint = {
            name: deviceid,
            data: Array.from({ length: 24 }).fill(0),
          };
          newDataPoint.data[hourOfDay] = totalPower;
          groupedHourlyData.push(newDataPoint);
        }
      });

      let totalPowerCurrentDay = 0;
      if (powerUsageTodayHourly) {
        powerUsageTodayHourly.map((hourdevice) => {
          totalPowerCurrentDay += hourdevice.totalPower;
        });
      }
      let monthlyusagecalctemp = [];
      let totalpricemonth = 0;

      if (powerUsagePerDevicePerDayFormatted) {
        powerUsagePerDevicePerDayFormatted.map((device) => {
          let sum = 0;
          for (let i = 0; i < device.data.length; i++) {
            sum += device.data[i];
          }
          // sum/=device.data.length
          monthlyusagecalctemp.push({
            name: device.name,
            totalmonthpower: sum,
          });
        });
      }
      const powerUsageByDeviceinDay = powerUsageTodayHourly.reduce(
        (acc, curr) => {
          if (!acc[curr.deviceid]) {
            acc[curr.deviceid] = 0;
          }
          acc[curr.deviceid] += curr.totalPower;
          return acc;
        },
        {}
      );
      let match_docs = await devicePriceModel.find({
        deviceid: { $in: devicenames },
      });
      let totalprice = [];
      match_docs.map((device) => {
        let totalpriceday = 0;
        let totalpricemonth = 0;
        if (powerUsageByDeviceinDay[device.deviceid]) {
          totalpriceday =
            (powerUsageByDeviceinDay[device.deviceid] * device.price) / 1000;
        }
        let monthfordevice = monthlyusagecalctemp.find(
          (d) => d.name === device.deviceid
        );
        if (monthfordevice) {
          totalpricemonth = monthfordevice.totalmonthpower * device.price;
        }
        totalprice.push({
          deviceid: device.deviceid,
          totalpricemonth: totalpricemonth,
          totalpriceday: totalpriceday,
        });
      });
      let price = {
        totalpricemonth: 0,
        totalpriceday: 0,
      };

      for (let i = 0; i < totalprice.length; i++) {
        price.totalpricemonth += totalprice[i].totalpricemonth;
        price.totalpriceday += totalprice[i].totalpriceday;
      }
      topDevicesLastWeek.map((device) => {
        device.totalPower /= 1000;
      });

      res.json({
        totalprice: price,
        powerUsageLastWeek: processedPowerUsage,
        topDevicesLastWeek,
        powerUsagePerDevicePerDayFormatted,
        groupedHourlyData,
        totalPowerCurrentDay,
        CurrentMonthPowTotal,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
app.get("/connecteddevices", async (req, res) => {
  const apiUrl = "http://<broker_url>:18083/api/v5/clients";
  const headers = {
    accept: "application/json",
    Authorization:
      "Basic YzcwMTFjZjBhMzNjY2NhZjpPeFpjUmluOUNQMFRWaUhSU09SSTNpVWlaQ1RPQm9MWWlUZEhaenNNZzRSQg==",
  };

  // Set query parameters
  const params = {
    page: 1,
    limit: 10000,
    node: "emqx@127.0.0.1",
  };

  // Make the Axios GET request
  axios
    .get(apiUrl, {
      headers: headers,
      params: params,
    })
    .then((response) => {
      let res1 = response.data.data;
      let connectedClients = [];
      res1.map((connection) => {
        if (connection.connected) {
          connectedClients.push({
            username: connection.username,
            connected_at: connection.connected_at,
            clientid: connection.clientid,
          });
        }
      });
      return res.json(connectedClients).status(200);
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.json(error).status(500);
    });
});
app.get("/pricedetails/:deviceid", async (req, res) => {
  const deviceid = req.params.deviceid;
  try {
    let devicePrice = await devicePriceModel.findOne({ deviceid: deviceid });

    if (!devicePrice) {
      devicePrice = new devicePriceModel({ deviceid: deviceid });
      await devicePrice.save();
    }

    res.json({ price: devicePrice.price });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put("/updateprice", async (req, res) => {
  const price = req.body.price;
  const deviceid = req.body.deviceid;

  try {
    let devicePrice = await devicePriceModel.findOne({ deviceid: deviceid });

    if (devicePrice) {
      devicePrice.price = price;
      await devicePrice.save();
      res.json({ message: "Price updated successfully" }).status(200);
    } else {
      res.status(404).json({ error: "Device not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/devicemodeldata", async (req, res) => {
  let token = req.headers.token;
  try {
    axios
      .get("http://<server_url>:5000/device_models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (data) => {
        let deviceList = data.data.devices;
        let retDeviceList = [];
        const models = await deviceModel.find(
          {},
          { _id: 0, deviceModelName: 1 }
        );
        const modelNames = models.map((model) => model.deviceModelName).flat();
        deviceList.forEach((device) => {
          if (modelNames.includes(device.device_model)) {
            retDeviceList.push(device);
          }
        });

        return res.json(retDeviceList).status(200);
      });
  } catch (err) {
    return res.json(err).status(500);
  }
});

app.post("/addmodel", async (req, res) => {
  try {
    let { devicename } = req.body;

    // Find if the device name already exists in the database
    const existingModel = await deviceModel.findOne({
      deviceModelName: devicename,
    });
    if (existingModel) {
      res.status(400).json({ message: "Device model already exists" });
    } else {
      await deviceModel.create({ deviceModelName: devicename });
      res.status(200).json({ message: "Device model added successfully" });
    }
  } catch (error) {
    console.error("Error adding device model:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log("Server running on port:", port);
});
