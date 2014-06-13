// User inputs
var inputTweet = "#OpenBeer heads to Hilltop Tavern this Friday at 5PM!";
var twitterHandles = ["@Lopesilvero", "@Jake_M_Ellis", "@JacyOh", "@yeahjoel", "@jasonwspencer", "@DaveD", "@DanVonderheide", "@DashOfGood", "@Eric_Littleton", "@all_ofthethings", "@XcellentTea", "@JohnPCullen", "@tchance121", "@eduardoalta", "@suhaslouisville", "@BoyerConsulting", "@kamurai", "@BoyerConsulting", "@WillBogel", "@all_ofthethings", "@Supermighty", "@aaronbacon", "@garrettbernard", "@all_ofthethings", "@MissUofL2013", "@GregLangdon", "@fibo1123n", "@ElizRounsavall", "@cbuddeke", "@zuph", "@zackpennington", "@loueyville", "@nickhuhn", "@forgehq_com", "@StartupKentucky", "@kstcstartups", "@startuplou"];
var link = "bit.ly/1hYkTCV"

// Program calculations
var maxTweetLength = 140;
var USERNAMEMAX = 15;
var outputFormula;
var formTweetType;


// Program outputs
var tweets = [];

function isLink(isCheck) {
	if (isCheck === true) {
		maxTweetLength = maxTweetLength -23;
		// 23 allows for the 22 characters plus a character for the space between the link and the rest of the tweet.
	}
}

function hashtagLocation(location) {
	if (location === "before") {
		formTweetType = 0;
		return formTweetType;
	}
	else {
		return formTweetType = 1;
	}
}

function checkLength(tweet) {

	var tooLong;

	// Test to see if initial tweet is too long.
	if (tweet.length > maxTweetLength) {
	
		tooLong = tweet.length - maxTweetLength;
		console.log("Sorry, your tweet is too long. Please reduce it by " + tooLong + " characters.");
		return 0;
	}
	
	// Test to see if tweet is too long to tag anyone.
	else if (tweet.length === maxTweetLength) {
	
		console.log("Sorry, it looks like we won't be able to tag anyone in this post. Please shorten your tweet.");
		return 0;
	}
	
	// Test to see if more than one person can be included in a tweet.
	else if (tweet.length > (maxTweetLength-USERNAMEMAX)) {
	
		console.log("We recommend making a shorter tweet so that we can include more user's in each tweet.");
		return 1;
	}
	else {
	
		return 1;
	}
}

function formTweetsBefore(tweet) {

	var arrayCounter = 0;
	var tweetLength = tweet.length;
	var outputTweet = tweet;

	while (arrayCounter < twitterHandles.length) {
		
		if (outputTweet.length + twitterHandles[arrayCounter].length <= maxTweetLength) {
			outputTweet = twitterHandles[arrayCounter] + " " + outputTweet;
			arrayCounter ++;
		}
		else
		{
			tweets.push(outputTweet);
			outputTweet = inputTweet;
		}
	}

	if (outputTweet !== tweet) {
	tweets.push(outputTweet + " " + link);
	}


	return tweets;
}

function formTweetsAfter(tweet) {

	var arrayCounter = 0;
	var tweetLength = tweet.length;
	var outputTweet = tweet;

	while (arrayCounter < twitterHandles.length) {
		
		if (outputTweet.length + twitterHandles[arrayCounter].length <= maxTweetLength) {
			outputTweet = outputTweet + " " + twitterHandles[arrayCounter];
			arrayCounter ++;
		}
		else
		{
			tweets.push(outputTweet + " " + link);
			outputTweet = inputTweet;
		}
	}

	if (outputTweet !== tweet) {
	tweets.push(outputTweet);
	}


	return tweets;
}

/* Still need to work on this...
// Takes list in from spreadsheet or input field on page and stores in twitterHandles variable
function createList () {

}
*/

isLink(true);

hashtagLocation("before");


// Check the length of the tweet. If short enough, form tweets based on whether user wants hashtags before or after.
if (checkLength(inputTweet) === 1) {
	if (formTweetType === 0) {
		formTweetsBefore(inputTweet);
	}
	else {
		formTweetsAfter(inputTweet);
	}
}

// Print out each individual tweet. Will be replaced in future with twitter API
for (var i = 0; i < tweets.length; i++ )
{
	console.log(tweets[i]);
}
