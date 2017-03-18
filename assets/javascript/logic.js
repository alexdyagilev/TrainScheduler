
$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDYgUng-miV7xHLl3L2xkT3w93Pjcrv0dY",
    authDomain: "trainscheduler-2add0.firebaseapp.com",
    databaseURL: "https://trainscheduler-2add0.firebaseio.com",
    storageBucket: "trainscheduler-2add0.appspot.com",
    messagingSenderId: "987709732249"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //var ref = new Firebase("https://trainscheduler-2add0.firebaseio.com");
  //ref.once("value", function(snapshot) {
    // var nameSnapshot = snapshot.child("name");
     //var name = nameSnapshot.val();

  //database.ref().on("child_added", function(childSnapshot){})

  var leadsRef = database.ref();
  //console.log("leadsRef: " + leadsRef);
  leadsRef.on('value', function(snapshot) {
    $('#tableBody').empty();
    //console.log("snapshot: " + snapshot.val());
    snapshot.forEach(function(childSnapshot) {
    //var childData = childSnapshot.val();
    //console.log(childSnapshot.val());
    var row = drawRows(childSnapshot);
    $("#tableBody").append(row);
    });
});


  var name = "";
  var destination = "";
  var first = 0;
  var frequency = 0;

  $("#addTrain").on("click", function(event){
  	event.preventDefault();

  	name = $("#name").val().trim();
  	destination = $("#destination").val().trim();
  	first = $("#first").val().trim();
  	frequency = $("#frequency").val().trim();

      var firstTrain = $("#first").val().trim(); //First Train time from form
      var now = moment(new Date()).format('HH:mm'); //Current Time

      var firstTrainArr = firstTrain.split(':');

      firstTrainArr = convertToMins(firstTrainArr);
      //firstTrainArr[0] = parseInt(firstTrainArr[0]); //first train hours as int
      //firstTrainArr[1] = parseInt(firstTrainArr[1]); //first train mins as int

      var firstTrainMins = (firstTrainArr[0]*60) + firstTrainArr[1]; //first train total in mins
      console.log("firstTrainMins: " + firstTrainMins);

      var currentArr = moment().format('HH:mm').split(':'); //Current time split into hours and min
      console.log("currentArr== " + currentArr[0] + " 2: " + currentArr[1]);

      currentArr = convertToMins(currentArr);
      //firstTrainArr[0] = parseInt(firstTrainArr[0]); //first train hours as int
      //firstTrainArr[1] = parseInt(firstTrainArr[1]); //first train mins as int

      var currentMins = (currentArr[0] * 60) + currentArr[1]; //Current time in mins

      console.log("currentMins: " + currentMins);

      //console.log("firstTrainArr[0]: " + firstTrainArr[0] + " [1]: " + firstTrainArr[1]);
      //console.log("firstTrainMins: " + firstTrainMins);

      //console.log("first: " + firstTrain + "-  now: " + now);

      if (currentMins > firstTrainMins) {
        var timeDifference = parseInt(currentMins) - parseInt(firstTrainMins);
        timeDifference = getTimeFromMins(timeDifference);
      }
      else {
        var timeDifference = parseInt(firstTrainMins) - parseInt(currentMins);
      }

      var nextTrain = "";

      if(now < firstTrain) {
        nextTrain = firstTrain;
        var minsAway = timeDifference;
      }
      else {
        var minsAway = nextArrival(firstTrainMins, currentMins, frequency);
        nextTrain = currentMins + minsAway;
        nextTrain = backToMT(nextTrain);
      }

      
      //console.log(firstTrain);
      //console.log(now);

      database.ref().push({
      name: name,
      destination: destination,
      first: first,
      frequency: frequency,
      nextTrain: nextTrain,
      minsAway: minsAway
    });
  		
    //database.ref().on("child_added", function(childSnapshot){
    //database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(childSnapshot) {
    //database.ref().limitToLast(1).on("child_added", function(snap) {
      //console.log("snap: " + snap);
      /*
      var row = $("<tr class='new-row'>") //New row in table to store the items below
      row.append("<td class='added'>" + name + "</td>"); //Train Name
      row.append("<td class='added'>" + destination + "</td>"); //Train Destination
      row.append("<td class='added'>" + frequency + "</td>"); //Train Frequency
      row.append("<td class='added'>" + nextTrain + "</td>"); //Next Arrival
      row.append("<td class='added'>" + minsAway + "</td>"); //Minutes Away
      console.log("row: " + row);
  		$("#tableBody").append(row);
      console.log("tableBody: " + $("#tableBody"));
      //})
      */
  });

});

function getTimeFromMins(mins) {
    if (mins >= 24 * 60 || mins < 0) {
        console.log("Valid input should be greater than or equal to 0 and less than 1440.");
    }
    var h = mins / 60 | 0,
        m = mins % 60 | 0;
    return moment.utc().hours(h).minutes(m).format("hh:mm");
}

function convertToMins(array) {
  array[0] = parseInt(array[0]); //hours as int
  array[1] = parseInt(array[1]); //mins as int

  return array;
}

function nextArrival(first, current, interval) {
  interval = parseInt(interval);
   while (first < current) {
     first += interval;
    }
  var minsAway = first - current;
    return minsAway;
}

function backToMT(min) {
  var hours = min / 60;
  hours = parseInt(hours);
  var mins = min % 60;
  if (mins == 0) {
    mins = mins + "" + mins;
  }
  var time = hours + ":" + mins;
  return time;
}

function drawRows(childSnapshot) {
  var row = $("<tr class='new-row'>") //New row in table to store the items below
      row.append("<td class='added'>" + childSnapshot.val().name + "</td>"); //Train Name
      row.append("<td class='added'>" + childSnapshot.val().destination + "</td>"); //Train Destination
      row.append("<td class='added'>" + childSnapshot.val().frequency + "</td>"); //Train Frequency
      row.append("<td class='added'>" + childSnapshot.val().nextTrain + "</td>"); //Next Arrival
      row.append("<td class='added'>" + childSnapshot.val().minsAway + "</td>"); //Minutes Away
  return row;
}