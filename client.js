// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const url = "wss://resttinder.glitch.me";
const connection = new WebSocket(url);

connection.onopen = () => {
  connection.send(JSON.stringify({"type": "helloClient"}));
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};


connection.onmessage = event => {
  console.log(event.data);
  let msgObj = JSON.parse(event.data);
  if(msgObj.type == "start"){
    console.log("got in start");
    
    console.log(msgObj.gameLink);
    window.location.replace(msgObj.gameLink);
  }
  else {
      console.log("error");
  }
};



  