const Handlebars = require('handlebars');
const { differenceInMinutes, parseISO } = require('date-fns');

// Handlebars.registerHelper('splitString', function (inputString, delimiter, partIndex) {
//   const parts = inputString.split(delimiter);
//   const trimmedTime = parts[1].startsWith("0") ? parts[1].slice(1) : parts[1];

//   const cleanedTime = trimmedTime.endsWith(":00") ? trimmedTime.slice(0, -3) : trimmedTime;
//   parts[1] = cleanedTime;
//   return parts[partIndex];
// });

Handlebars.registerHelper('splitString', function (inputString, delimiter, partIndex) {
  if (!inputString || typeof inputString !== "string") return "";

  const parts = inputString.split(delimiter);

  // bảo vệ nếu partIndex vượt quá độ dài mảng
  if (!parts[partIndex]) return "";

  const trimmedTime = parts[1] && parts[1].startsWith("0") 
    ? parts[1].slice(1) 
    : parts[1];

  const cleanedTime = trimmedTime && trimmedTime.endsWith(":00") 
    ? trimmedTime.slice(0, -3) 
    : trimmedTime;

  parts[1] = cleanedTime || parts[1];

  return parts[partIndex];
});


Handlebars.registerHelper('calculateDuration', function (departure_datetime, arrival_datetime) {
  const departureDate = parseISO(departure_datetime);
  const arrivalDate = parseISO(arrival_datetime);

  const minutesDifference = differenceInMinutes(arrivalDate, departureDate);
  const hours = Math.floor(minutesDifference / 60);
  let minutes = minutesDifference % 60;
  if(minutes == 0){
    minutes = '00'
  }
  return hours + 'h' + minutes;
});

Handlebars.registerHelper('formatCurrency', function (amount) {
  const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  return formattedAmount;
});

Handlebars.registerHelper('JSONStringify', function (object) {
  return JSON.stringify(object);
});

// Handlebars.registerHelper('compareStringValue', function (value1, value2, options) {
//   if(value1 == value2){
//     return options.fn(true);
//   }
//   return options.fn(false);
// });

module.exports = Handlebars;