const scriptObj = {};

scriptObj.fetchDate = function (){
      const isoString = new Date().toISOString();
      const options = { month: "long", day: "numeric", year: "numeric" };
      const date = new Date(isoString);
      const americanDate = new Intl.DateTimeFormat("en-US", options).format(date);
      return americanDate;
}

// Idea for random post suggestions
// let ambient = ["post 1", "post 2", "post 3", "post 4", "post 5", "post 6", "post 7", "post 8", "post 9", "post 10"];
// getRandomPost(ambient, 4);
// function getRandomPost(genre, amount){
//       let selection = [];
//       for(var i = 0; i < amount; i++){
//             let randomPost = Math.floor(Math.random() * Math.floor(genre.length));
//             selection.push(genre[randomPost]);
//             genre.splice(randomPost, 1);
//       }
//       console.log(selection);
// }

module.exports = scriptObj;