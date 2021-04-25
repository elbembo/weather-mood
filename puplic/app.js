/* Global Variables */
const app = document.querySelector('#app');
const radioBtn = document.querySelectorAll('input[type="radio"]');
const loadungUI = document.querySelector('#loading');
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?';

const apiKey = '&appid=ba960daefc10c56dc6f7608b7d568c3e'
let weather = {};
let fahrenheit = false;
let tempUnit = '&units=metric';
let tempSin = '°C';
//let temperature = { temp: 0, sin: "°F" }
let stormAnimation = { t1: null, t2: null, t3: null }


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
/**
 * helper functions
 */
/* const temperatureConvertor = (temp) => {
    if (fahrenheit) {
        return temperature = { temp: Math.floor((temp - 273.15) * 9 / 5 + 32), sin: '°F' }
    }
    return temperature = { temp: Math.floor(temp - 273.15), sin: '°C' }
} */
function changeTempSin(e) {
    if (e.target.value == 'fahrenheit') {
        tempUnit = '&units=imperial';
        tempSin = '°F';
        fahrenheit = true;
    } else {
        tempUnit = '&units=metric';
        tempSin = '°C';
        fahrenheit = false;
    }
    generateJornal()
}
function lodaing(con = true) {
    if (con) {
        loadungUI.style.display = 'block'
    } else {
        loadungUI.style.display = 'none'
    }

}
/**
 * End helper functions
 */
/**
 * basic functions
 */
// Async POST
const postData = async (url = '', data = {}) => {
    const postRequest = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await postRequest.json();
        return newData;
    }
    catch (error) {
        console.error(error);
    }
}
// Async GET
const getTemperature = async (url = '') => {
    const response = await fetch(url)
    try {
        weather = await response.json();
        return weather;
    }
    catch (error) {
        console.error(error);
    }
}
const generateJornal = async (e) => {
    lodaing(true)
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value ;
    getTemperature(baseURL + "zip=" + zipCode + ',us' + apiKey + tempUnit)
        .then((data) => {

            if (data.cod == "200") {// from Openweather.com API . 200 mean we get the right data 
                // Add data to POST request
                postData('/addEntry', { temperature: data.main.temp, date: newDate, feeling: feelings })
                    .then((data) => {
                        updateUI(data)
                    }).then(() => {
                        lodaing(false)
                    })

            } else {
                alert(data.message)
                lodaing(false)
            }
        })

}
// Update user interface
const updateUI = async (userData) => {

    const request = await fetch('/entry');
    try {
        const projectData = await request.json();
        document.getElementById('date').innerHTML = projectData.date;
        document.getElementById('temp').innerHTML = Math.floor(projectData.temperature);
        document.getElementById('temp').dataset.content = tempSin
        document.getElementById('content').innerHTML = projectData.feeling;
        const weatherIcon = app.querySelector('.forcast-icon img')
        app.querySelector('.city-name h3').textContent = weather.name
        app.querySelector('.weather-temp h2').innerHTML = `<span>${weather.weather[0].main}</span>${Math.floor(weather.main.temp)}`
        app.querySelector('.weather-temp h2').dataset.content = tempSin

        weatherIcon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
        document.body.style.backgroundImage = `url('./images/${weather.weather[0].main}.jpg')`
        window.scrollTo({
            top: document.getElementById('entryHolder').offsetTop,
            behavior: 'smooth'
        });
        // just for fun
        if (projectData.feeling.toUpperCase().trim() === "STORM") {
            document.body.style.backgroundImage = `url('./images/Thunderstorm.jpg')`
            stormAnimation = {
                t1: setInterval(function () {
                    app.classList.toggle("storm");
                }, 275),
                t2: setInterval(function () {
                    app.classList.toggle("storm");
                }, 800)
                ,
                t3: setInterval(function () {
                    app.classList.toggle("storm");
                }, 1200)
            }
            const audio = document.getElementById("stormAudio");
            audio.play();
        } else {
            clearInterval(stormAnimation.t1)
            clearInterval(stormAnimation.t2)
            clearInterval(stormAnimation.t3)
            app.classList.remove("storm");
            const audio = document.getElementById("stormAudio");
            audio.pause();
        }

    }
    catch (error) {
        console.log('error', error);
    }
}
postData('/addEntry', { temperature: '', date: '', feeling: '' }) // empty old data from server when refresh
document.getElementById('generate').addEventListener('click', generateJornal);

radioBtn.forEach((ele) => {
    ele.addEventListener("change", changeTempSin)

})
/**
 * get a Geo of user by  loccation
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
const geoFindMe = () => {
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        /**
         * get a weather by user loccation
         */
        lodaing(true)
        getTemperature(baseURL + `lat=${latitude}&lon=${longitude}` + apiKey + tempUnit).then(() => {
            updateUI();
        }).then(lodaing(false))

    }

    function error() {
        console.log('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
    } else {
        console.log('Locating…');
        navigator.geolocation.getCurrentPosition(success, error);
    }

}

document.addEventListener('DOMContentLoaded', geoFindMe)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/sw.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}