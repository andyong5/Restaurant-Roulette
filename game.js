
// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const url = "wss://resttinder.glitch.me";
const connection = new WebSocket(url);

let left = document.getElementById("left");
let right = document.getElementById("right");
let progressBar = document.getElementById("progress");

let leftRest;
let rightRest;

left.addEventListener("click", () => {
  console.log("Liked left restaurant");
  let selectDiv = document.getElementById("selectDiv");
  selectDiv.style.display = "none";
      
  let waiting = document.getElementById("waitingDiv");
  waiting.style.display = "block";
  
  let name1 = document.getElementById("name1");
  let cmdObj = {
    "type": "command",
    "selection":leftRest,
  }
  console.log(cmdObj);
  connection.send(JSON.stringify(cmdObj));
});

right.addEventListener("click", () => {
  let selectDiv = document.getElementById("selectDiv");
  selectDiv.style.display = "none";
      
  let waiting = document.getElementById("waitingDiv");
  waiting.style.display = "block";
  
  console.log("Liked right restaurant");
  let name2 = document.getElementById("name2");
  let cmdObj = {
    "type": "command",
    "selection": rightRest,
  }
  console.log(cmdObj);
  connection.send(JSON.stringify(cmdObj));
});

function firstRest(){
  let msgObj = {
    "type": "displayRest"
  }
  connection.send(JSON.stringify(msgObj));
  console.log("got here");
}

var done=false;
function queueNextRound(){
  // document.getElementById("tie").textContent = "";
  if( done==false){
    let msgObj= {
    "type": "nextRound"
    }
    connection.send(JSON.stringify(msgObj));
    console.log("next round");
  }
  
}
connection.onopen = () => {

  connection.send(JSON.stringify({"type": "helloClient"}));
    firstRest();
  
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};



connection.onmessage = event => {
  console.log(event.data);
  
  let msgObj = JSON.parse(event.data);
  if(msgObj.type == "start"){
    console.log("nothing");
  }
  
  else if(msgObj.type == "display"){
    leftRest = msgObj["rest1"];
    console.log(JSON.stringify(leftRest));
    
    let tieDiv = document.getElementById("tie")
     tieDiv.style.display = "none";
    
    let name1 = document.getElementById("name1");
    name1.textContent = msgObj["rest1"].name;
    
    let pic1 = document.getElementById("pic1");
    pic1.src = msgObj["rest1"].img;
    
    let address1 = document.getElementById("address1");
    address1.textContent = msgObj["rest1"].address;
    
    let stars1 = document.getElementById("stars1");
    
    stars1.innerHTML = "";
    for(var x = 0; x < 5; x++){
        if(x < msgObj["rest1"].rating){
            stars1.textContent += "\u2605";
        }else{
          stars1.textContent +="\u2606";
        }
      }
    
    
    let dollar1 = document.getElementById("dollar1");
    dollar1.textContent = msgObj["rest1"].price;
    
    let review1 = document.getElementById("review1");
    review1.innerHTML = msgObj["rest1"].review_count;
    
    
    
     rightRest = msgObj["rest2"];
    console.log(JSON.stringify(rightRest));
    
    let name2 = document.getElementById("name2");
    name2.textContent = msgObj["rest2"].name;
    
    let pic2 = document.getElementById("pic2");
    pic2.src = msgObj["rest2"].img;
    
    let address2 = document.getElementById("address2");
    address2.textContent = msgObj["rest2"].address;
    
    let stars2 = document.getElementById("stars2");
    stars2.innerHTML = "";
    for(var x = 0; x < 5; x++){
        if(x < msgObj["rest2"].rating){
            stars2.textContent += "\u2605";
        }else{
          stars2.textContent +="\u2606";
        }
      }
    
    let review2 = document.getElementById("review2");
    review2.innerHTML = msgObj["rest2"].review_count;
    
    let dollar2 = document.getElementById("dollar2");
    dollar2.textContent = msgObj["rest2"].price;
  }
  else if(msgObj.type =="roundWinner"){
    console.log("got here in winner");
    
    console.log("The winner is this "+msgObj["winner"]);
    let waitingDiv = document.getElementById("waitingDiv");
    waitingDiv.style.display = "none";
    
    let tieDiv = document.getElementById("tie")
     tieDiv.style.display = "none";
    
     let winnerDiv = document.getElementById("winnerDiv");
    winnerDiv.style.display = "flex";
    
    let swname = document.getElementById("swname");
    swname.textContent = msgObj["winner"].name;
    
    let name = document.getElementById("wname");
    name.textContent = msgObj["winner"].name;
    
    let wpic = document.getElementById("wpic");
    wpic.src = msgObj["winner"].img;
    
    let waddress = document.getElementById("waddress");
    waddress.textContent = msgObj["winner"].address;
    
    let wstars = document.getElementById("wstars");
    wstars.innerHTML = "";
    for(var x = 0; x < 5; x++){
      if(x< msgObj["winner"].rating){
          wstars.textContent += "\u2605";
      }else{
        wstars.textContent +="\u2606";
      }
    }
    
    
    let wdollar = document.getElementById("wdollar");
    wdollar.textContent = msgObj["winner"].price;
    
    let wreview = document.getElementById("wreview");
    wreview.innerHTML = msgObj["winner"].review_count;
    
    setTimeout(queueNextRound, 5000); //wait two seconds to show user the winner then queue the next round
  
  }
  else if(msgObj.type =="tie"){
    document.getElementById("tie").style.display = "block";
    document.getElementById("waitingDiv").style.display = "none";
    document.getElementById("winnerDiv").style.display = "none";
    document.getElementById("tie").textContent = "THERE IS A TIE";
    setTimeout(queueNextRound, 5000); //wait two seconds to show user the winner then queue the next round
    
  }
  
  else if(msgObj.type == "nextRound"){
    
    let winnerDiv = document.getElementById("winnerDiv"); //set winner div to none 
     winnerDiv.style.display = "none";
    
     let tieDiv = document.getElementById("tie")
     tieDiv.style.display = "none";
    
    let waitingDiv = document.getElementById("waitingDiv"); //set waitingDiv to none
     waitingDiv.style.display = "none";
    
    let selectDiv = document.getElementById("selectDiv"); //show selection div again, then put in variables.
    selectDiv.style.display = "flex";
    
    leftRest = msgObj["rest1"];
     console.log(msgObj["rest1"].name);
    
    let name1 = document.getElementById("name1");
    name1.textContent = msgObj["rest1"].name;
    
    let pic1 = document.getElementById("pic1");
    pic1.src = msgObj["rest1"].img;
    
    let address1 = document.getElementById("address1");
    address1.textContent = msgObj["rest1"].address;
    
    let stars1 = document.getElementById("stars1");
    stars1.innerHTML = "";
    for(var x = 0; x < 5; x++){
        if(x < msgObj["rest1"].rating){
            stars1.textContent += "\u2605";
        }else{
          stars1.textContent +="\u2606";
        }
      }
    
    let dollar1 = document.getElementById("dollar1");
    dollar1.textContent = msgObj["rest1"].price;
    
    let review1 = document.getElementById("review1");
    review1.innerHTML = msgObj["rest1"].review_count;
    
    rightRest = msgObj["rest2"];
    console.log(msgObj["rest2"].name);
    
    let name2 = document.getElementById("name2");
    name2.textContent = msgObj["rest2"].name;
    
    let pic2 = document.getElementById("pic2");
    pic2.src = msgObj["rest2"].img;
    
    let address2 = document.getElementById("address2");
    address2.textContent = msgObj["rest2"].address;
    
    let stars2 = document.getElementById("stars2");
    stars2.innerHTML = "";
    for(var x = 0; x < 5; x++){
        if(x < msgObj["rest2"].rating){
            stars2.textContent += "\u2605";
        }else{
          stars2.textContent +="\u2606";
        }
      }
    
    let review2 = document.getElementById("review2");
    review2.innerHTML = msgObj["rest2"].review_count;
    
    let dollar2 = document.getElementById("dollar2");
    dollar2.textContent = msgObj["rest2"].price;
  }
  
  else if(msgObj.type == "finalWinner"){
   
    console.log("Final Winner");
    
    console.log("The winner is this "+msgObj["rest"]);
    let waitingDiv = document.getElementById("waitingDiv");
    waitingDiv.style.display = "none";
    
    let tieDiv = document.getElementById("tie")
     tieDiv.style.display = "none";
    
    document.getElementById("isWinner").textContent = "is the final game winner!";
    
     let winnerDiv = document.getElementById("winnerDiv");
    winnerDiv.style.display = "flex";
    
    let swname = document.getElementById("swname");
    swname.textContent = msgObj["rest"].name;
    
    let name = document.getElementById("wname");
    name.textContent = msgObj["rest"].name;
    
    let wpic = document.getElementById("wpic");
    wpic.src = msgObj["rest"].img;
    
    let waddress = document.getElementById("waddress");
    waddress.textContent = msgObj["rest"].address;
    
    let wstars = document.getElementById("wstars");
    wstars.innerHTML = "";
    for(var x = 0; x < 5; x++){
      if(x< msgObj["rest"].rating){
          wstars.textContent += "\u2605";
      }else{
        wstars.textContent +="\u2606";
      }
    }
    
    
    let wdollar = document.getElementById("wdollar");
    wdollar.textContent = msgObj["rest"].price;
    
    let wreview = document.getElementById("wreview");
    wreview.innerHTML = msgObj["rest"].review_count;
    
    done=true;
    
  }
  
  else if(msgObj.type == "randWinner"){
   
    console.log("Random Winner");
    
    console.log("The winner is this "+msgObj["rest"]);
    let waitingDiv = document.getElementById("waitingDiv");
    waitingDiv.style.display = "none";
    
    let tieDiv = document.getElementById("tie")
     tieDiv.style.display = "none";
    
    document.getElementById("isWinner").textContent = "is the final game winner chosen by the AI because there have been two ties!";
    
     let winnerDiv = document.getElementById("winnerDiv");
    winnerDiv.style.display = "flex";
    
    let swname = document.getElementById("swname");
    swname.textContent = msgObj["rest"].name;
    
    let name = document.getElementById("wname");
    name.textContent = msgObj["rest"].name;
    
    let wpic = document.getElementById("wpic");
    wpic.src = msgObj["rest"].img;
    
    let waddress = document.getElementById("waddress");
    waddress.textContent = msgObj["rest"].address;
    
    let wstars = document.getElementById("wstars");
    wstars.innerHTML = "";
    for(var x = 0; x < 5; x++){
      if(x< msgObj["rest"].rating){
          wstars.textContent += "\u2605";
      }else{
        wstars.textContent +="\u2606";
      }
    }
    
    
    let wdollar = document.getElementById("wdollar");
    wdollar.textContent = msgObj["rest"].price;
    
    let wreview = document.getElementById("wreview");
    wreview.innerHTML = msgObj["rest"].review_count;
    
    done=true;
  }
  
  else {
      console.log("error");
  }
  
 
};

