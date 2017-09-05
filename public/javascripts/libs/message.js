var moment = require('moment');
var locationUrl = (long, lat) => {
    return `https://www.google.com/maps?q=${lat},${long}`;
};

var locationMessage = (long, lat) => {
    return {
        from: 'Admin',
        url: locationUrl(long, lat),
        createAt: moment().valueOf()
    }
};


module.exports = {locationMessage};