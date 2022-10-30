/* Magic Mirror
 * Module: MMM-Letterboxd
 *
 * By Tristan Burke, https://github.com/tristanburke
 * MIT Licensed.
 */


Module.register("MMM-Letterboxd", {


	defaults: {
		maxItems: 4,
		usernames: ["jmur14", "mburke44", "louphilly", "hkremer"],
	},

	start: function () {
		this.loaded = false;
		this.activityData = [];
		this.scoreToStar = {
			"-1.0": "None",
			0.5: "½",
			"1.0": "★",
			1.5: "★½",
			"2.0": "★★",
			2.5: "★★½",
			"3.0": "★★★",
			3.5: "★★★½",
			"4.0": "★★★★",
			4.5: "★★★★½",
			"5.0": "★★★★★",
		};
		this.sendSocketNotification("GET_ACTIVITY", {usernames: this.config.usernames});
	},

	getStyles: function() {
		return [ 'modules/MMM-Letterboxd/MMM-Letterboxd.css' ];
	},

	notificationReceived: function(notification, payload, sender) {
		switch(notification) {
			case "DOM_OBJECTS_CREATED":
			  var timer = setInterval(()=>{
			  	this.sendSocketNotification("GET_ACTIVITY", {usernames: this.config.usernames});
			  }, 5000) // 600000 = 10 Minutes
			  break
		}
	},

	socketNotificationReceived: function(notification, payload) {
	switch(notification) {
		case "ACTIVITY_RETRIEVED":
			this.loaded = true;
			this.activityData = payload.activityData;
			this.updateDom();
			break
		}
	},

	getDom: function() {

		let wrapper = document.createElement('table');
		wrapper.className = 'bright xsmall';

		// If nothing has loaded yet, put in placeholder text
		if (!this.loaded) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = 'loading dimmed xsmall';
			return wrapper;
		}

		// Create activity table
		let row = document.createElement('tr');
		let numItems = Math.min(this.config.maxItems, this.activityData.length);
		for (let i = 0; i < numItems; ++i) {
			// Create a new Cell for each activity and append to the row
			let activity = this.activityData[i];
			row.appendChild(this.createCell(activity));
		}
		wrapper.appendChild(row);

		// return wrapper
		return wrapper;
	},

	createCell: function(activity) {
		let cell = document.createElement('td');

		// Add Image
		let img = document.createElement('img');
		img.src = activity.image
		cell.appendChild(img);

		// Create Rating div
		let rating = document.createElement('div');
		rating.innerHTML = this.scoreToStar[activity.rating]; // convert to starts
		rating.style.cssText = 'text-align: left; width:50%; float: left;';

		// Create User div
		let user = document.createElement('div');
		user.innerHTML = activity.username;
		user.style.cssText = 'text-align: right; margin-left:50%;';

		// Parent to information/cell
		let info = document.createElement('div');
		info.appendChild(rating);
		info.appendChild(user);
		cell.appendChild(info);
		return cell;
	},
})
