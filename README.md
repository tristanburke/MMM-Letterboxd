# MMM-Letterboxd
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows displays recent activity from a set of Letterboxd users. 

![screenshot](https://user-images.githubusercontent.com/16827681/199129832-3eb3a2fa-3051-4d48-994e-0b8ad09a8664.png)

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/tristanburke/MMM-Letterboxd
```
2. Install dependencies:
```
	cd MMM-Letterboxd/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
		  module: "MMM-Letterboxd",
		  position: "top_right",
		  header: "Letterboxd",
		  config: {
				maxItems: 4,
				usernames: ["smittyW1"],
				fetchInternval: 300000, // 5 minutes
				scale: "small"
			}
		},
```
# Configuration
| Option                        | Description
| ------------------------------| -----------
| `maxItems`                    | How many reviews to display.<br />**Default value:** 4
| `usernames`                   | Which users to retrieve letterboxd review from.<br />**Default value:** []
| `fetchInternval`              | How often the module pulls data.<br />**Default value:** 300000 == 5 minutes
| `scale`.                      | Either "small" or "medium" - the two display options.<br />**Default value:** small


