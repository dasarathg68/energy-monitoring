import axios from 'axios';
let data = require('./config.json');
const instance=axios.create({
    baseURL:data.production,
    
});
export default instance;
