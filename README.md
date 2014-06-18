# H@ndler
*by @Lopesilvero*

**H@ndler is an online tool to easily create a series of tweets directed at a group of Twitter handles.**


## Background

An entreprenueral community based out of Louisville, KY organized weekly events using the hashtag #OpenBeer with a new location each week. The location of the event was distributed via Twitter but it was quickly realized that not all members would see the tweet due to their "cluttered" Twitter feed. The organizer then started to tag invitees in the tweets in order to make sure they would see the event details. However, as the community grew it became cumbersome to create so many of the same tweets while trying to remember everyone to include. *Enter H@ndler*


## Solution

With H@ndler, the organizer is able to direct interested participants to a quick form that allows them to submit their Twitter handle so they can receive the weekly location. The organizer is then able to post that list of Twitter handles into H@ndler along with the tweet and a link if preferred. H@ndler then creates all of the Tweets. 


## Tasks In Progress

* Adjust logic to automatically determine if there is a link within link field rather than the original checkbox method.


##Future Features

* Animation for when Tweets are being posted
* Automatically determine if the tweet has a link.
* Order Twitter handles by length on the backend in order to create the least amount of Tweets
* Allow a user to save their list of Twitter handles

## Completed Tasks

* Connect form to logic that creates Tweets
* Determine way of displaying constructed Tweets
* Validation for Twitter handle field - Make sure only one handle per line and @ is used before string
* Twitter integration that automatically posts Tweets without having to copy & paste
* Approve Tweets before they are sent to Twitter

## Running H@ndler locally

With Ruby 2.0.0,

```shell
# Install foreman and bundler if not already available
$ gem install foreman
$ gem install bundler

# Clone the repository if not already done
$ git clone https://github.com/Lopesilvero/handler
$ cd handler

# Install our bundle (gems required for app)
$ bundle install

# Start foreman (serves app on http://localhost:5000)
$ foreman start
```