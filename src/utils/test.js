const date = new Date(Date.now());

const dateString = "" + date.getFullYear();

if (date.getMonth() > 6) dateString += "13";
else {
  dateString += "11";
}
console.log(dateString);
