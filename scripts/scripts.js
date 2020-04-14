const scriptObj = {};

scriptObj.fetchDate = function (){
      const isoString = new Date().toISOString();
      const options = { month: "long", day: "numeric", year: "numeric" };
      const date = new Date(isoString);
      const americanDate = new Intl.DateTimeFormat("en-US", options).format(date);
      return americanDate;
}

module.exports = scriptObj;