// users: Array of user objects in the league. Assume this will be populated by parsing a JSON file from our server.
var users = [{name: "user0"}, {name: "user1"}, {name: "user2"}, {name: "user3"}, {name: "user4"}, {name: "user5"}, {name: "user6"}, {name: "user7"}, {name: "user8"}, {name: "user9"}];
/* schedule: Array to contain an int array for each week's matchup order. 
Each int represents the index of the corresponding user object in the users array. */
var schedule = [];
var numOfWeeks;

createSchedule();
printSchedule();

/* Generates the schedule of matchups based on the number of participating users.
Stores each week's user order in the schedule array. */
function createSchedule() {
	numOfWeeks = users.length - 1;  // Determine number of weeks (n users - 1)
	// Set up initial order for user matchups
	var initialOrder = [];
	for (let i = 0; i < users.length; i++) {
		initialOrder.push(i);
	}
	schedule.push(initialOrder);

	// Populate schedule array with each week's matchup order
	for (let week = 1; week < numOfWeeks; week++) {
		schedule.push(nextOrder(schedule[week-1]));
	}
}

function printSchedule() {
	document.write("Regular Season:<br>");
	for (let i = 0; i < schedule.length; i++) {
		document.write("Week " + (i+1) + ": " + getWeekMatchups(schedule[i]) + "<br>");
	}
	document.write("<br>Playoffs:<br>");
	document.write("Week " + (schedule.length + 1) + ": semi-finalist0 vs semi-finalist3&nbsp&nbsp&nbsp&nbspsemi-finalist1 vs semi-finalist 2<br>");
	document.write("Week " + (schedule.length + 2) + ": finalist0 vs finalist1");
}

/* Determines next matchup order based on round robin algorithm.
Last user in previous order becomes second user in new order. */
function nextOrder(prevOrder) {
	var next = [];
	var lastE = prevOrder[prevOrder.length - 1];  // Store last element
	next.push(prevOrder[0]);  // First element stays unchanged
	next.push(lastE);  // Move last element to second element
	for (let i = 1; i < prevOrder.length - 1; i++){
		next.push(prevOrder[i]);
	}	
	return next; // Return next week's array
}

/* Determine current week's matchups based on current week's player order.
Uses round robin pairing. Returns as string for printing */
function getWeekMatchups(currOrder) {
	var matches = "";
	var half = Math.trunc(currOrder.length/2);  // For odd number of users, ensure an int value
	for (let i = 0; i < half; i++){
		var userA = users[currOrder[i]].name;
		var userB = users[currOrder[currOrder.length-1-i]].name;
		matches += userA + " vs " + userB + "&nbsp&nbsp&nbsp&nbsp";
	}	
	return matches;
}

function getUserMatchup(user, week) {
	// Return the user opponent matched up against given user for a given week
}