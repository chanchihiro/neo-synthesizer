// bpmとかいじる

let timerID = null;
let interval = 100;

self.onmessage = function(e){
  if (e.data == "start") {
	console.log("スタート");
	timerID = setInterval( function() {postMessage("tick");}, interval)
  } else if (e.data.interval) {
	console.log("setting interval");
	interval = e.data.iånterval;
	console.log("interval=" + interval);
	if (timerID) {
	  clearInterval(timerID);
	  timerID = setInterval(function() {postMessage("tick");}, interval)
	}
  } else if (e.data == "stop") {
	console.log("stopping");
	clearInterval(timerID);
	timerID = null;
  }
};