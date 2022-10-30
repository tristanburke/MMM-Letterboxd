/* Magic Mirror
 * Module: MMM-Letterboxd
 *
 * By Tristan Burke, https://github.com/tristanburke
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var fetch = require('node-fetch');
var cheerio = require('cheerio');

module.exports = NodeHelper.create({

	
	start: function() {
		console.log('Starting node_helper for: ' + this.name);
		this.activityData = [];
	},


	socketNotificationReceived: function(notification, payload) {
		switch(notification) {
			case "GET_ACTIVITY":
				this.getActivity(payload.usernames);
				this.sendSocketNotification("ACTIVITY_RETRIEVED", { activityData: this.activityData });
		}
	},


	getActivity: async function(usernames) {

		// Retrieve diary data for each username and await all data
		let promises = [];
		for (const username of usernames) {
			promises.push(this.getDiaryData(username));
		}
		let allActivity = await Promise.all(promises);

		// Flatten activity data per username into one list
		allActivity = allActivity.flat();

		// Sort all activity by Date
		allActivity.sort(function(x, y) {
			if (x.date > y.date) {
				return -1;
			}
		});
		this.activityData = allActivity;
	},


	getDiaryData: function(username) {
		const uri = `https://letterboxd.com/${username}/rss/`;

		return fetch(uri)
		.then((response) => {
		  // if 404 we're assuming that the username does not exist or have a public RSS feed
		  if (response.status === 404) {
		    throw new Error(
		      `No RSS feed found for username by "${username}" at Letterboxd`
		    );
		  } else if (response.status !== 200) {
		    throw new Error("Something went wrong");
		  }
		  return response.text();
		})
		.then((xml) => {
		  const $ = cheerio.load(xml, { xmlMode: true });

		  const items = [];

		  $("item").each((i, element) => {
		    items[i] = this.processItem($(element), username);
		  });
		  return items;
		});
	},

	processItem: function(item, username) {
		return {
			date: new Date(item.find("letterboxd\\:watchedDate").text()),
			title: item.find("letterboxd\\:filmTitle").text(),
			rating: item.find("letterboxd\\:memberRating").text(),
			image: this.getImage(item),
			username: username
		}
	},


	getImage: function(item) {
		// find the film poster and grab it's src
		const description = item.find("description").text();
		const $ = cheerio.load(description);
		const image = $("p img").attr("src");

		// if the film has no image return no object
		if (!image) {
			return {};
		}
		const originalImageCropRegex = /-0-.*-crop/;
		return image.replace(originalImageCropRegex, "-0-150-0-225-crop");
	}
});