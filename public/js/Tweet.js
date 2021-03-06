// Create an IIFE to prevent our vars and methods from using 
// the window's scope
(function (window, document, $, undefined) {
  // Grab references to our input fields
  var inputTweet = document.getElementById('inputTweet'),
      tweetLink = document.getElementById('tweetLink'),
      handleList = document.getElementById('handleList');

  // Create an object responsible for data and functionality
  // of our app
  var app = {
    maxTweetLength: 140,
    USERNAMEMAX: 15,
    outputFormula: null,
    formTweetType: null,
    tweets: [],
    link: '',
    handles: [],
    state: '',
    errorMessage: '',
    tweetPreviewTemplate: '<li>%%TWEET%%</li>',

    isLink: function isLink(isCheck) {
      if (isCheck === true) {
        app.maxTweetLength = app.maxTweetLength -23;
        // 23 allows for the 22 characters plus a character for the space between the link and the rest of the tweet.
      }
    },

    hashtagLocation: function hashtagLocation(location) {
      if (location === 'before') {
        app.formTweetType = 0;
        return app.formTweetType;
      }
      else {
        return app.formTweetType = 1;
      }
    },

    checkLength: function checkLength(tweet) {
      var tooLong, g2g;

      if (tweet.length > app.maxTweetLength) {
        // initial tweet is too long.
        tooLong = tweet.length - app.maxTweetLength;
        app.errorMessage = 'Sorry, your tweet is too long. Please reduce it by ' + tooLong + ' characters.';
        g2g = false;
      } else if (tweet.length === app.maxTweetLength) {
        // tweet is too long to tag anyone.
        app.errorMessage = "Sorry, it looks like we won't be able to tag anyone in this post. Please shorten your tweet.";
        g2g = false;
      } else if (tweet.length > (app.maxTweetLength-app.USERNAMEMAX)) {
        // more than one person can't be included in a tweet.
        app.errorMessage = 'We recommend making a shorter tweet so that we can include more users in each tweet.';
        g2g = true;
      } else {
        g2g = true;
      }

      if (!g2g) {
        app.state = 'warn';
        app.updateState();
      }
    },

    formTweetsBefore: function formTweetsBefore(tweet) {
      var arrayCounter = 0,
          tweetLength = tweet.length,
          outputTweet = tweet;

      while (arrayCounter < app.handles.length) {
        if (outputTweet.length + app.handles[arrayCounter].length <= app.maxTweetLength) {
          outputTweet = app.handles[arrayCounter] + ' ' + outputTweet;
          arrayCounter ++;
        } else {
          app.tweets.push(outputTweet);
          outputTweet = inputTweet;
        }
      }

      if (outputTweet !== tweet) {
        app.tweets.push(outputTweet + ' ' + app.link);
      }

      return app.tweets;
    },

    formTweetsAfter: function formTweetsAfter(tweet) {
      var arrayCounter = 0,
          tweetLength = tweet.length,
          outputTweet = tweet;

      while (arrayCounter < app.handles.length) {
        if (outputTweet.length + app.handles[arrayCounter].length <= app.maxTweetLength) {
          outputTweet = outputTweet + ' ' + app.handles[arrayCounter];
          arrayCounter ++;
        } else {
          app.tweets.push(outputTweet + ' ' + app.link);
          outputTweet = inputTweet;
        }
      }

      if (outputTweet !== tweet) {
        app.tweets.push(outputTweet + ' ' + app.link);
      }

      return app.tweets;
    },

    // Grabs link text from input field to use later
    // TODO: We should validate the link here
    parseLink: function parseLink(linkText) {
      app.link = linkText;
    },

    // Parses Twitter handles from the textarea
    parseHandles: function parseHandles(handlesText) {
      // turn our string into an array of lines
      app.handles = handlesText.split("\n").
        // remove empty lines
        filter(function (item) { return typeof item !== 'undefined' && item !== null && item !== ''; }).
        // trim whitespace
        map(function (item) { return item.trim(); }).
        // ensure handles start with @
        map(function (item) { 
          if (item.substring(0,1) !== '@') {
            item = '@' + item;
          }
          return item;
        });

      // TODO: why doesn't this work?
      if (app.handles.length === 0) {
        app.errorMessage = 'Please ensure handles are formatted correctly.';
        app.state = 'warn';
        app.updateState();
      }
    },

    // Builds the contents of the tweets to preview and later send
    // TODO: add in logic to switch between before and after formatting
    buildTweets: function buildTweets() {
      app.formTweetsBefore(inputTweet.value);
    },

    // Generates HTML for previewing built tweets
    showTweets: function showTweets() {
      var html = '',
          count = app.tweets.length;

      for (var i = 0; i < count; i++) {
        var tweet = app.tweets[i];
        html += app.tweetPreviewTemplate.replace('%%TWEET%%', tweet);
      }

      $('#tweet-previews').html(html);
    },

    // Starts the loop to send all tweets
    sendTweets: function sendTweets() {
      app.sendTweet(0);
    },

    // Sends an individual tweet item to our `/post-tweet` endpoint
    sendTweet: function sendTweet(i) {
      var tweet = app.tweets[i];
      console.log(tweet);
      $.ajax({
        type: 'POST',
        url: '/post-tweet',
        data: { tweet: tweet },
        success: function () {
          if (app.tweets.length === i+1) {
            // if at the end of the list, stop and reset
            app.reset();
          } else {
            // f there are more, send the next tweet
            app.sendTweet(i+1);
          }
        }
      });
    },

    // Resets our form to the initial state
    reset: function reset() {
      inputTweet.value = '';
      tweetLink.value = '';
      handleList.value = '';
      outputFormula = null;
      formTweetType = null;
      tweets = [];
      link = '';
      handles = [];
      state = '';
      errorMessage = '';

      $('.view-panel').hide();
      $('#error-message').hide();
      $('#main-panel').show();
    },

    // Controls switching states
    //
    // 'warn' presents an error message after validation
    // 'confirm' previews built tweets prior to sending
    // 'verify' validates user's inputs
    updateState: function updateState() {
      $('.view-panel').hide();
      $('#error-message').hide();

      switch (app.state) {
        case 'warn':
          $('#error-message .alert').html(app.errorMessage);
        
          $('#error-message').show();
          $('#main-panel').show();
        case 'confirm':
          $('#sending-panel').show();
          app.sendTweets();       
          break;
        case 'verify':
          app.checkLength(inputTweet.value);
          app.parseLink(tweetLink.value);
          app.parseHandles(handleList.value);
          app.buildTweets();
          app.showTweets();

          $('#confirmation-panel').show();
          break;
        default:
          $('#main-panel').show();
          break;
      }}
  };

  // Wait until the DOM is ready to add our event handlers
  $(document).ready(function () {

    // Capture the form submission, and handle everything client-side
    $('form').submit(function (e) {
      e.preventDefault();

      switch (app.state) {
        case 'verify':
          app.state = 'confirm';
          break;
        default:
          break;
      }
      if (!app.state) app.state = 'verify';
      app.updateState();

      if (window.location.hostname.indexOf('localhost') !== -1) console.log(app);
    });

  });

  $('.reset').click(function () {
    e.preventDefault();
    app.reset();
  });

})(window, document, jQuery);
