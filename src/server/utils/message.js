const moment = require("moment");

let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf(),
  };
};
let generateLocationMessage = (from, lat, lng) => {
  return {
    from,
    url: `https://www.google.com/maps/place/${lat},${lng}`,
    createdAt: moment().valueOf(),
  };
};
module.exports = {
  generateMessage,
  generateLocationMessage,
};
