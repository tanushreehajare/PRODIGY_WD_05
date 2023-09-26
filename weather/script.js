const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=337423aed43ef4670d2ebbb0dfd2f930`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=337423aed43ef4670d2ebbb0dfd2f930`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;

        const currentTime = new Date(); // Get the current time
        const isDaytime = isDay(currentTime, info.sys.sunrise, info.sys.sunset);

        const weatherIconSrc = getWeatherIcon(id, isDaytime);

        wIcon.src = weatherIconSrc;
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

function isDay(currentTime, sunrise, sunset) {
    return currentTime >= new Date(sunrise * 1000) && currentTime < new Date(sunset * 1000);
}

function getWeatherIcon(weatherId, isDaytime) {
    if (weatherId == 800) {
        return isDaytime ? "icons/sunny.png" : "icons/crescent-moon.png";
    } else if (weatherId >= 200 && weatherId <= 232) {
        return isDaytime ? "icons/windy.png" : "icons/windy-night.png";
    } else if (weatherId >= 600 && weatherId <= 622) {
        return isDaytime ? "icons/snowflake.png" : "icons/snowfall.png";
    } else if (weatherId >= 701 && weatherId <= 781) {
        return isDaytime ? "icons/clear-sky.png" : "icons/night.png";
    } else if (weatherId >= 801 && weatherId <= 804) {
        return isDaytime ? "icons/cloudy-day.png" : "icons/cloud.png" ;
    } else if ((weatherId >= 500 && weatherId <= 531) || (weatherId >= 300 && weatherId <= 321)) {
        return isDaytime ? "icons/rainy-day.png" : "icons/rainy.png" ;
    }
}
