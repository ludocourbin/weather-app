// Write the functions that hit the API. You’re going to want functions that can take a location and return the
// weather data for that location.For now, just console.log() the information.

// data = http://api.openweathermap.org/data/2.5/weather?q=paris&appid=2636c5cb22df3006dd1caad933db8a81;
// import { moment } from './moment.js';
// let moment = moment;
// console.log(moment);
const API = '2636c5cb22df3006dd1caad933db8a81';

let city = 'paris';

const app = {
	domElts: {
		userChoice: document.getElementById('user-choice'),
		city: document.getElementById('city'),
		country: document.getElementById('country'),
		icon: document.getElementById('icon'),
		description: document.getElementById('weather-description'),
		temperature: document.getElementById('temperature'),
		wind: document.getElementById('wind'),
		sunrise: document.getElementById('sunrise'),
		sunset: document.getElementById('sunset'),
	},
	userCityChoice: 'paris',
};

console.log(app.domElts.icon);

app.domElts.userChoice.addEventListener('keyup', function (e) {
	if (e.key === 'Enter') {
		app.userCityChoice = app.domElts.userChoice.value;
		userAction();
	}
});

//openweathermap.org/weather-conditions

// https://community.algolia.com/places/

const userAction = async () => {
	const response = await fetch(
		`http://api.openweathermap.org/data/2.5/weather?q=${app.userCityChoice}&units=metric&appid=${API}`
	);
	const myJson = await response.json(); //extract JSON from the http response
	// do something with myJson
	console.log(myJson);
	app.domElts.city.textContent = myJson.name;
	app.domElts.country.textContent = myJson.sys.country;
	app.domElts.description.textContent = myJson.weather[0].description;
	app.domElts.icon.setAttribute(
		'src',
		'http://openweathermap.org/img/wn/' + myJson.weather[0].icon + '@2x.png'
	);

	app.domElts.temperature.textContent = myJson.main.temp;
	app.domElts.sunrise.textContent = formatDate(
		myJson.sys.sunrise,
		myJson.timezone
	);
	app.domElts.sunset.textContent = formatDate(
		myJson.sys.sunset,
		myJson.timezone
	);
};

userAction();

function formatDate(timestamp, utc) {
	let date = new Date((timestamp + utc - 7200) * 1000);
	let datevalues = date.getHours() + 'h ' + date.getMinutes() + 'min ';
	return datevalues;
}
