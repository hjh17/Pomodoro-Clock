var start = true;
var alarmSound = "http://soundbible.com/grab.php?id=1134&type=mp3"
var audio = new Audio(alarmSound);


///<<<---- pomodoro clock ---->>>
function stopWatch(sessionTime,inputTime,breakLength,statusText){
  var sessionLength = inputTime;
  var breakInterval = breakLength;
  var interval;
  var offset;
  var status = "session";

  function update() {
    inputTime -= delta();
    var formattedTime = timeFormatter(inputTime);
    sessionTime.textContent = formattedTime;
    statusText.textContent = status;
    checkConditions(inputTime);
  }

  function updateBreak() {
    breakLength -= delta();
    var formattedTime = timeFormatter(breakLength);
    sessionTime.textContent = formattedTime;
    statusText.textContent = status;
    checkConditions(breakLength);
  }

  function checkConditions(elem){
    if(elem < 0 && status == "session"){
      audio.play();
      status = "break";
      breakLength = breakInterval;
      this.watch.stop();
      this.watch.startTimeBreak();
      return false;
    }
    if(elem < 0 && status == "break"){
      audio.play();
      status = "session";
      inputTime = sessionLength;
      this.watch.stop();
      this.watch.startTime();
      return false;
    }
  }

  function delta(){
    var now = Date.now();
    var timePassed = now-offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(timeMilliseconds){
    var time = new Date(timeMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliSeconds = time.getMilliseconds().toString().substring(0,2);

    if(minutes.length < 2){
      minutes = "0" + minutes;
    }
    if(seconds.length < 2){
      seconds = "0" + seconds;
    }
    while(milliSeconds.length < 2){
      milliSeconds = "0" + milliSeconds;
    }

    return minutes + ":" + seconds + ":" + milliSeconds;
  }

  this.isOn = false;
  this.startTime = function(){
    if(!this.isOn){
      interval = setInterval(update, 10);
      offset = Date.now();
      this.isOn = true;
    }
  };

  this.startTimeBreak = function(){
    if(!this.isOn){
      interval = setInterval(updateBreak, 10);
      offset = Date.now();
      this.isOn = true;
    }
  };

  this.stop = function(){
    if(this.isOn){
      clearInterval(interval);
      interval = null;
      this.isOn = false;
    }
  };

  this.reset = function(){
    time = 25*60000;
  };
}

var newWatch = false;
var inputTime = 25*60000;
var breakLength = 5*60000;
var timer = document.getElementById("timer");
var statusBar = document.getElementById("status");
var watch = new stopWatch(timer,inputTime,breakLength,statusBar);


// <<<---- CONTROLS ---->>>>
$('#start').click(function(event) {
if(newWatch == true){
    timer = document.getElementById("timer");
    watch = new stopWatch(timer,inputTime,breakLength,statusBar);
    newWatch = false;
    }

  if(start){
    var changeStop = "<i class='fa fa-stop-circle-o' aria-hidden='true'></i> Stop";
    document.getElementById("start").innerHTML = changeStop;
    start = false;
    watch.startTime();
  }
  else {
    var changeStart = "<i class='fa fa-clock-o' aria-hidden='true'></i> Start";
    document.getElementById("start").innerHTML = changeStart;
    start = true;
    watch.stop();
}
});

$('#reset').click(function() {
  if(!watch.isOn){
    watch.stop();
    document.getElementById("timer").innerHTML = "25:00.00";
    timer = document.getElementById("timer");
    watch = new stopWatch(timer,25*60000,5*60000,"session");
    newWatch = false;
    document.getElementById("sessionLength").innerHTML = "25";
  }
});


$('#breakDecr').click(function() {
  if(!watch.isOn){
  newWatch = true;
  currentBreak = document.getElementById("breakLength").innerHTML;
  if(currentBreak !== "1")
  {
    --currentBreak;
  }
  document.getElementById("breakLength").innerHTML = currentBreak;
  breakLength = currentBreak * 60000;
}
});

$('#breakIncr').click(function() {
  currentBreak = document.getElementById("breakLength").innerHTML;
  if(currentBreak !== "60")
  {
    ++currentBreak;
  }
  document.getElementById("breakLength").innerHTML = currentBreak;
  breakLength = currentBreak * 60000;
});

$('#sessionDecr').click(function() {
  if(!watch.isOn){
  newWatch = true;
  currentSession = document.getElementById("sessionLength").innerHTML;
  if(currentSession !== "1")
  {
    --currentSession;
  }
  document.getElementById("sessionLength").innerHTML = currentSession;
  if(currentSession.toString().length === 1){
    var time = "0"+ currentSession + ":00.00";
    document.getElementById("timer").innerHTML = time;

  }
  if(currentSession.toString().length === 2)
      document.getElementById("timer").innerHTML = currentSession + ":00.00";
  inputTime = currentSession * 60000;
}
});

$('#sessionIncr').click(function() {
  if(!watch.isOn){
  newWatch = true;
  currentSession = document.getElementById("timer").innerHTML.substring(0, 2);
  if(currentSession !== "60")
  {
    ++currentSession;
  }
  document.getElementById("sessionLength").innerHTML = currentSession;
  if(currentSession.toString().length === 1){
    var time = "0"+ currentSession + ":00.00";
    document.getElementById("timer").innerHTML = time;

  }
  if(currentSession.toString().length === 2)
      document.getElementById("timer").innerHTML = currentSession + ":00.00";
  inputTime = currentSession * 60000;
  }
});
