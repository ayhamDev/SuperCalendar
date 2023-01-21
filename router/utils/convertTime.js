function Convert24To12(time) {
  let [hour, min] = time.split(":");
  let type = "";
  hour = parseInt(hour);
  min = parseInt(min);
  if (hour >= 12) {
    type = "PM";
    hour = hour - 12;
  } else {
    type = "AM";
  }
  if (hour == 0) {
    hour = "12";
  }
  if (min == 0) {
    min = "00";
  }
  if (min < 10) {
    min = `0${min}`;
  }

  return `${hour}:${min} ${type}`;
}
module.exports = { Convert24To12 };
