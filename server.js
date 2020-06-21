const WebSocket = require("ws");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const sql = require("sqlite3").verbose();
const http = require("http");

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let players = 0;
let voteCount = 0;

let tieVotes = 0;

var rand1;
console.log(rand1);
var rest1;

var rand2;
console.log(rand2);
var rest2;
var tie = false;

app.use(bodyParser.json());

var rest1Votes = 0;
var rest2Votes = 0;
var roundWinner;
var loser;

wss.on("connection", ws => {
  players++;
  console.log("Current players = " + players);
  ws.on("message", message => {
    let cmdObj = JSON.parse(message);
    if (cmdObj.type == "command") {
      console.log("user picked " + cmdObj["selection"].name);
      if (cmdObj["selection"].name == rest1.name) {
        rest1Votes++;
        console.log("rest1Votes = ", rest1Votes);
        console.log("rest2Votes = ", rest2Votes);
      } else if (cmdObj["selection"].name == rest2.name) {
        rest2Votes++;
        console.log("rest1Votes = ", rest1Votes);
        console.log("rest2Votes = ", rest2Votes);
      }

      voteCount += 1;
      console.log("Vote count = " + voteCount);
      if (voteCount >= players) {
        if (rest1Votes > rest2Votes) {
          let nrObj = { type: "roundWinner", winner: rest1 };
          broadcast(JSON.stringify(nrObj));
          roundWinner = rest1;
          loser = rest2;
        } else if (rest2Votes > rest1Votes) {
          let nrObj = { type: "roundWinner", winner: rest2 };
          broadcast(JSON.stringify(nrObj));
          roundWinner = rest2;
          loser = rest1;
        } else {
          let nrObj = { type: "tie" };
          broadcast(JSON.stringify(nrObj));
          tie = true; //set tie to true, so no deleting occcurs.
        }
        rest1Votes = 0;
        rest2Votes = 0;
        voteCount = 0;
        for (var i = 0; i < restaurantList.length; i++) {
          if (tie) {
            if (deleteList.length == 2) {
              tieVotes += 1;
            }
            tie = false; //if there is a tie set it back to false, don't want to delete.
            break; //breakout
          }
          if (restaurantList[i].name == loser.name) {
            console.log("Removed loser = " + loser.name);
            console.log("DeleteList length = " + deleteList.length);
            deleteList.splice(i, 1);
            console.log("DeleteList length = " + deleteList.length);
          }
        }
        getRandNumbers();
      }

      //console.log("one user selected restaurant", restaurantList['name'][cmdObj.selection]);
      //       var index1=-1;
      //       var index2=-1;
      //       for(var i =0; i<restaurantList.length; i++){
      //         if(restaurantList[i]==undefined){
      //           continue;
      //         }
      //         //console.log("hereeeeeeeeeeeeeeeeeeeeeeeeee");
      //         if(restaurantList[i].name==cmdObj.selection){
      //             //console.log("yeeeeeeeeeeeee");

      //             //console.log(restaurantList[i]);
      //             if(rest11==""){
      //               rest11=restaurantList[i];
      //               rest11.votes+=1;
      //               index1=i;
      //             }
      //             else if(rest22=="" && rest11!=restaurantList[i]){
      //               rest22=restaurantList[i];
      //               rest22.votes+=1;
      //               index2=i;
      //             }

      //             break;
      //         }
      //       }

      // console.log(rest11);
      // console.log(rest22);
      // console.log(rest11.votes);
      // console.log(rest22.votes);
      // voteCount += 1;
      // console.log("Vote count = "+voteCount);
      // if (voteCount == players) {
      //     console.log("got in if statement");
      //     if(deleteList.length==1){
      //       let nrObj = {'type': 'rwinner', 'winner': rest11};
      //       broadcast(JSON.stringify(nrObj));
      //     }
      //     voteCount = 0;
      //     if(rest22=="" || rest11.votes > rest22.votes){
      //       let nrObj = {'type': 'winner', 'winner': rest11};
      //       // delete deleteList[index2];
      //       broadcast(JSON.stringify(nrObj));
      //     }
      //     else if(rest22.votes>rest11.votes){
      //       let nrObj = {'type': 'winner', 'winner': rest22};
      //       // delete deleteList[index1];
      //       broadcast(JSON.stringify(nrObj));
      //     }
      //     else{
      //       let nrObj = {'type': 'tie', 'winner': restaurantList[0]};
      //       broadcast(JSON.stringify(nrObj));
      //     }

      // rest11="";
      // rest22="";
      // rest11.votes=0;
      // rest22.votes=0;
      // getRandNumbers();
      // }
    }
    if (cmdObj.type == "displayRest") {
      let nrObj = { type: "display", rest1: rest1, rest2: rest2 };
      broadcast(JSON.stringify(nrObj));
    }
    if (cmdObj.type == "start") {
      console.log("got to start");
      console.log(cmdObj.link);
      let nrObj = {
        type: "start",
        gameLink: cmdObj.gameLink,
        clientLink: cmdObj.clientLink
      };
      broadcast(JSON.stringify(nrObj));
      getRandNumbers();
    }
    if (cmdObj.type == "nextRound") {
      let nrObj = { type: "nextRound", rest1: rest1, rest2: rest2 };
      console.log(nrObj);
      broadcast(JSON.stringify(nrObj));
    }
  });
  ws.on("close", () => {
    players -= 1;
    console.log("a user disconnected --", players, "users connected");
  });
  ws.send("connected!");
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}
var obj;
app.post("/start", express.json(), (request, response) => {
  obj = request.body;
  console.log(obj);
  response.json({ obj });
});

//start our server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

// const restDB = new sql.Database("restaurant.db");

// let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='restaurantTable' ";
// restDB.get(cmd, function (err, val) {
//     console.log(err, val);
//     if (val == undefined) {
//         console.log("No database file - creating one");
//         createPostCardDB();
//     } else {
//         console.log("Database file found");
//     }
// });

// function createPostCardDB() {
//   // explicitly declaring the rowIdNum protects rowids from changing if the
//   // table is compacted; not an issue here, but good practice
//   const cmd = 'CREATE TABLE restaurantTable ( gameID TEXT PRIMARY KEY, image TEXT, message TEXT, font TEXT,color TEXT)';
//   restDB.run(cmd, function(err, val) {
//     if (err) {
//       console.log("Database creation failure",err.message);
//     } else {
//       console.log("Created database");
//     }
//   });
// }

("use strict");

const yelp = require("yelp-fusion");
const client = yelp.client(
  "XVqVlh9h5p6kS64dnfoCIx-jZiPoggIVh9gyWXkeBfPF9ainozmmAO4ndjYEZiCfMg56hId6Of37b8U7ZnUUKE0MUtGdQ7BZJcIhoAos_PgiKUHT0ouu5IKtb6faXnYx"
);

class Restaurant {
  constructor(name, price, rating, review_count, img, address) {
    this.name = name;
    this.price = price;
    this.rating = rating;
    this.review_count = review_count;
    this.img = img;
    this.address = address;
    this.votes = 0;
  }
}

let restaurantList = [];
let deleteList = [];

app.post("/getList", function(req, res) {
  restaurantList = [];
  deleteList = [];
  console.log(req.body);
  let food = req.body.food;
  let location = req.body.location;
  console.log(food + " and " + location);

  client
    .search({
      term: food,
      location: location
    })
    .then(response => {
      for (var x = 0; x < 16; x++) {
        console.log(
          response.jsonBody.businesses[x].name +
            " and price is " +
            response.jsonBody.businesses[x].price
        );
        let rest = new Restaurant(
          response.jsonBody.businesses[x].name,
          response.jsonBody.businesses[x].price,
          Math.round(response.jsonBody.businesses[x].rating),
          response.jsonBody.businesses[x].review_count,
          response.jsonBody.businesses[x].image_url,
          response.jsonBody.businesses[x].location.address1 +
            ", " +
            response.jsonBody.businesses[x].location.city +
            ", " +
            response.jsonBody.businesses[x].location.state +
            " " +
            response.jsonBody.businesses[x].location.zip_code
        );
        restaurantList.push(rest);
      }
      deleteList = restaurantList;
      for (var x = 0; x < restaurantList.length; x++) {
        console.log(restaurantList[x].name);
      }
      console.log(restaurantList.length);
      res.send(JSON.stringify(restaurantList));
    })
    .catch(e => {
      console.log(e);
    });
});

function getRandNumbers() {
  console.log("got in here");
  //when only two left and a tie happend twice
  if (deleteList.length == 2 && tieVotes == 2) {
    rand1 = Math.floor(Math.random() * deleteList.length);
    console.log("rand winner =" + rand1);
    let nrObj = { type: "randWinner", rest: deleteList[rand1] };
    broadcast(JSON.stringify(nrObj));
    console.log("finished");
  } else if (deleteList.length > 1) {
    rand1 = Math.floor(Math.random() * deleteList.length);
    console.log("rand number1 =" + rand1);
    rest1 = deleteList[rand1];

    rand2 = Math.floor(Math.random() * deleteList.length);
    if (rand2 == rand1) {
      while (rand2 == rand1) {
        rand2 = Math.floor(Math.random() * deleteList.length);
      }
    }
    console.log("rand number2 =" + rand2);
    rest2 = deleteList[rand2];
    console.log("deletelist length = " + deleteList.length);
  }
  //only one rest left and it's the winner
  else if (deleteList.length == 1) {
    let nrObj = { type: "finalWinner", rest: deleteList[0] };
    broadcast(JSON.stringify(nrObj));
    console.log("finished");
  }
}
