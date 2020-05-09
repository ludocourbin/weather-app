// Write the functions that hit the API. You’re going to want functions that can take a location and return the
// weather data for that location.For now, just console.log() the information.

// data = http://api.openweathermap.org/data/2.5/weather?q=paris&appid=2636c5cb22df3006dd1caad933db8a81;
// import { moment } from './moment.js';
// let moment = moment;
// console.log(moment);
const API = '2636c5cb22df3006dd1caad933db8a81';

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
		textToSpeech: document.getElementById('text'),
	},
	userCityChoice: 'paris',
};

console.log(app.domElts.icon);
let myUrl;

app.domElts.userChoice.addEventListener('keyup', function (e) {
	if (e.key === 'Enter') {
		app.userCityChoice = app.domElts.userChoice.value;
		myUrl = `https://source.unsplash.com/1600x900/?${app.userCityChoice}`;
		console.log(myUrl);
		document.body.style.background = `url("${myUrl}")`;
		userAction();
	}
});

//openweathermap.org/weather-conditions

const userAction = async () => {
	const response = await fetch(
		`http://api.openweathermap.org/data/2.5/weather?q=${app.userCityChoice}&units=metric&appid=${API}`
	);
	const myJson = await response.json(); //extract JSON from the http response
	// do something with myJson
	// console.log(myJson);
	app.domElts.city.textContent = myJson.name;
	app.domElts.country.textContent = myJson.sys.country;
	app.domElts.description.textContent = myJson.weather[0].description;
	app.domElts.icon.setAttribute(
		'src',
		'https://openweathermap.org/img/wn/' +
			myJson.weather[0].icon +
			'@2x.png'
	);

	if (myJson.weather[0].description.includes('rain')) {
		app.domElts.icon.setAttribute('src', './images/rain.svg');
	} else if (myJson.weather[0].description.includes('clouds')) {
		app.domElts.icon.setAttribute('src', './images/sun.png');
	} else if (myJson.weather[0].description.includes('clear')) {
		app.domElts.icon.setAttribute('src', './images/sun.svg');
	} else if (myJson.weather[0].description.includes('sun')) {
		app.domElts.icon.setAttribute('src', './images/sun.svg');
	}

	app.domElts.temperature.textContent = myJson.main.temp;
	app.domElts.sunrise.textContent = formatDate(
		myJson.sys.sunrise,
		myJson.timezone
	);
	app.domElts.sunset.textContent = formatDate(
		myJson.sys.sunset,
		myJson.timezone
	);

	msg.text = `In ${myJson.name} it is ${myJson.main.temp} degrees it is at the moment ${app.domElts.description.textContent} and the wind is blowing at ${app.domElts.wind.textContent} kilometer an hour, further information about this city, the sunset it's at ${app.domElts.sunset.textContent} and tomorrow, the sun will be rising at ${app.domElts.sunrise.textContent}. The weather app wish you a wonderful day`;

	console.log(msg.text);
};

userAction();

function formatDate(timestamp, utc) {
	let date = new Date((timestamp + utc - 7200) * 1000);
	let datevalues = date.getHours() + 'h' + date.getMinutes() + 'min ';
	return datevalues;
}

const msg = new SpeechSynthesisUtterance();
let voices = [];

const voicesDropdown = document.querySelector('[name="voice"]');
// const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

function populateVoices() {
	voices = this.getVoices();
	const voicesOptions = voices
		.map(
			(voice) =>
				`<option value ="${voice.name}">${voice.name}(${voice.lang})</option>`
		)
		.join('');
	voicesDropdown.innerHTML = voicesOptions;
}

function setVoice() {
	msg.rate = 0;
	console.log('changing voice');
	msg.voice = voices.find((voice) => voice.name === this.value);
	toggle();
}

function toggle(startOver = true) {
	speechSynthesis.cancel();
	if (startOver) {
		speechSynthesis.speak(msg);
	}
}

speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change', setVoice);
speakButton.addEventListener('click', toggle);
stopButton.addEventListener('click', function () {
	toggle(false);
});
