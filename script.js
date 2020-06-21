// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const url = "wss://resttinder.glitch.me";
const connection = new WebSocket(url);

let start = document.getElementById("start");

let ran = Math.random().toString(36).substring(6);
var gLink = window.location.href+"game.html?id="+ran;
var cLink = window.location.href+"client.html?id="+ran;
document.getElementById("msg").textContent=cLink;


start.addEventListener("click", function() { startGame(); });
document.getElementById("gamePage").style.display="none";


document.getElementById("gamePage").style.display="block";
function startGame(){
  let msgObj = {
    "type": "start",
    "from": "host",
    "gameLink": gLink,
    "clientLink": cLink
  }
  connection.send(JSON.stringify(msgObj));
  window.location.replace(gLink);
}



connection.onopen = () => {
  connection.send(JSON.stringify({"type":"helloHost"}));
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = event => {
  let msgObj = JSON.parse(JSON.stringify(event.data));
};

/* 
setInterval(() => {
  let msg = "hearbeat";
  addMessage("host:" + msg)
  connection.send(msg);
}, 4000);
*/

// let searchBTN = document.getElementById("searchFood");

// searchBTN.addEventListener("click", function(){searchFood();});

// function searchFood(){
//   let food = document.getElementById("food");
//   let location = document.getElementById("location");
  
// }


document.getElementById('searchFood').addEventListener('click', () => {
  event.preventDefault();
  let food = document.getElementById('food');
  let location = document.getElementById('location');
  console.log(food.value);
  let data = {
    food: food.value,
    location: location.value
  }
   console.log(data);

  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.open("POST", '/getList');
  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
  xmlhttp.onloadend = function(e) {
    console.log(xmlhttp.responseText);
    document.getElementById("warnDiv").style.display = "none";
    document.getElementById("searchDiv").style.display = "block";
    document.getElementById("startDiv").style.display = "block";
    let data = JSON.parse(xmlhttp.responseText);
    console.log("This is data 1 "+data[0].name);
    for(var x = 0; x < 16; x++){
      document.getElementById("rt"+x).innerHTML = data[x].name;
    }
    
  }
  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
});
  
  
  // yelp autocomplete
  
//   'use strict';

//   const yelp = require('yelp-fusion');
//   const client = yelp.client('XVqVlh9h5p6kS64dnfoCIx-jZiPoggIVh9gyWXkeBfPF9ainozmmAO4ndjYEZiCfMg56hId6Of37b8U7ZnUUKE0MUtGdQ7BZJcIhoAos_PgiKUHT0ouu5IKtb6faXnYx');

//   client.autocomplete({
//     text: food, location: location
//   }).then(response => {
//     console.log(response.jsonBody.terms[0].text);
//   }).catch(e => {
//     console.log(e);
//   });
// })

// var complete = GET https://api.yelp.com/v3/autocomplete;

var cuisine = ["Afghan", "African", "American", "Argentine", "Arabian", "Armenian", "Asian Fusion","Australian","Austrian", "Barbeque", "Bangladeshi", "Basque", "Brasseries", "Brazilian","British","Breakfast & Brunch","Buffets","Bulgarian","Burgers","Burmese","Cafes","Cafeteria","Cajun","Cambodian","Caribbean","Chicken Wings","Chinese","Comfort Food","Creperies","Cuban","Delis","Diners","Dim Sum","Egyptian","Ethiopian","Fast Food","Filipino","Fondue", "Food Court", "Food Stands","French","Georgian","German","Greek","Gluten-Free","Guamanian","Halal","Hawaiian","Honduran","Hot Pot","Hungarian","Iberian","Indian","Indonesian","Irish","Italian","Japanese","Kebab","Korean","Kosher","Laotian","Latin American","Malaysian","Mediterranean","Mexican","Middle Eastern","Mongolian","Moroccan","New Mexican","Nicaraguan","Noodles","Pakistani","Pan Asian","Polish","Persian","Peruvian","Portuguese","Polynesian","Pop-Up Restuarants","Russian","Salad","Sandwiches","Scandinavian","Seafood","Singaporean","Shanghainese","Slovakian","Somali","Soul Food","Soup","Southern","Spanish","Sri Lankan","Steakhouses","Sushi Bars","Syrian","Tacos","Taiwanese","Tapas","Tapas Bars","Tex-Mex","Thai","Turkish","Ukrainian","Uzbek","Vegan","Vegetarian","Vietnamese","Waffles","Wraps"];

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { 
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

autocomplete(document.getElementById("food"), cuisine);
