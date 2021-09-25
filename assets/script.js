var forecastContainerEl = document.querySelector("#fiveday-container");
var forecastTitle = document.querySelector("#forecast");

var city = "Austin";
var buttonWeather = document.querySelector("#btn");
var forecastContainerEl = document.querySelector("#fiveday-container");

buttonWeather.addEventListener("click", function (e) {
  e.preventDefault();
  //$('button').hide(); 

  //var nextEl = document.querySelector("#next-btn");
  function weatherForecastStart() {
    var openWeatherForecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=3f698036d7cb81fb192ca1a1ad2af845`;

    fetch(openWeatherForecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);

      forecastContainerEl.textContent = "";
      forecastTitle.textContent = "Please check upcoming weather conditions prior to picking a date to play";

      var forecast = response.list;
      for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];
        console.log(dailyForecast);

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-light m-2";

        //create date element
        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment
          .unix(dailyForecast.dt)
          .format("MMM D");
        forecastDate.classList = "card-header text-center";
        forecastEl.appendChild(forecastDate);
        console.log(forecastDate);

        //create an image element
        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
        );

        //append to forecast card
        forecastEl.appendChild(weatherIcon);

        //create temperature span
        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = Math.round(dailyForecast.main.temp) + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        //append to forecast card
        forecastEl.appendChild(forecastHumEl);

        // console.log(forecastEl);
        //append to five day container
        forecastContainerEl.appendChild(forecastEl);
      }
    });
  }
  weatherForecastStart();

  function weatherCurrentStart() {
    var openWeatherCurrentUrl = `https://api.openweathermap.org/data/2.5/weather?q=Austin&units=imperial&appid=3f698036d7cb81fb192ca1a1ad2af845`;
  
    fetch(openWeatherCurrentUrl)
    .then(function (response) {
      return response.json(); 
    })
    .then(function (response) {
      console.log(response);
  
      var currentName = document.getElementById("current-name");
      var currentIcon = document.getElementById("current-icon");
      var currentDescription = document.getElementById("current-description");
  
      var nameTitle = document.createElement("span");
      var uppercase = response.name.toUpperCase() + " " + "weather".toUpperCase();
      nameTitle.className = "city-title";
      nameTitle.textContent = uppercase;
        
  
      var iconTitle = document.createElement("img");
      iconTitle.setAttribute("src", `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`); 
  
      var number = document.createElement("span");
      number.textContent = Math.round(response.main.temp) + " °F";
      number.className = "temp"
  
      var text = document.createElement("p");
      text.textContent = response.weather[0].description;
      text.className = "text-description"; 
  
  
      currentName.appendChild(nameTitle);
      currentIcon.appendChild(iconTitle);
      currentDescription.appendChild(number);
      currentDescription.appendChild(text); 
    });
  }
  weatherCurrentStart();
});

// google map fields markers
var locations = [
  ["Slaughter Creek Fields 4", 30.198, -97.8836],
  ["Onion Creek Soccer Complex", 30.1771, -97.7403],
  ["Tillery Fields", 30.2703, -97.6999],
  ["Sanchez Soccer Field", 30.2571, -97.7354],
  ["Quarry Field", 30.3992, -97.7358],
];
var fieldList = document.getElementById("selected-fields")
const infowindow = new google.maps.InfoWindow();

// events map
var events = new Map();
// events.set("Slaughter Creek Fields 4",[{teamName: "Paul",teamCaptain: "George", phoneNumber: "512", email: "email", date: "09/04/2021"}]);
// events.set("Onion Creek Soccer Complex",[{teamName: "Paul",teamCaptain: "George", phoneNumber: "512", email: "email", date: "09/04/2021"}]);
addEventToMap("Slaughter Creek Fields 4", "Wolf", "George", "512-555-5555", "CaptainGeorge@email", "9/24/2021","5");
addEventToMap("Slaughter Creek Fields 4", "Wild Cats", "Rey", "512-123-4567", "CaptainRey123@email", "10/25/2021","7");
// map display and markers

var map = new google.maps.Map(document.getElementById("map"), {
  zoom: 10,
  center: new google.maps.LatLng(30.266666, -97.73333),
});

  // lop through locations array
for (var i = 0; i < locations.length; i++) {
  // console.log(locations[i][1], locations[i][2]);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    map: map,
  });

  marker.addListener("click", (function (marker, i) {

    return function () {
      infowindow.setContent(`<h1>${locations[i][0]}</h1 class="table"><button onclick="displayEvent(this)" data-location-name="${locations[i][0]}"> Events</button>`)
      infowindow.open(map, marker)


    }
  })(marker, i));
}

// addMarker({
//   coords:{lat: 30.1980, lng: -97.8836},
//   // content:'<h1>Slaughter Creek Fields 4</h1>'
// });

// 
/*function displayEvent(evt) {
  var locationTable = document.querySelector("#location-table");
  locationTable.removeAttribute("class");
  var tBody = document.querySelector("#t-body");
  const locationName = evt.dataset.locationName;
  
  if (events.has(locationName)) {
    const locationEvents = events.get(locationName);
    

    // empty out the tbodies
    tBody.innerHTML = "";
    // creating new rows 
    for (let index = 0; index < locationEvents.length; index++) {
      const locationOfEvent = locationEvents[index];


      var row = document.createElement("tr");

      // itterate through the properties in the object
      for (const property in locationOfEvent) {
        if (Object.hasOwnProperty.call(locationOfEvent, property)) {
          const propertyValue = locationOfEvent[property];
          createCell(propertyValue, row);
        }
      }

      tBody.appendChild(row);
    }
  }

}*/


// displaying the form for the calendar
$(document).ready(function () {
  var date_input = $('input[name="date"]'); //our date input has the name "date"
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  date_input.datepicker({
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  })
})
// calendar section start
var submitBtn = document.querySelector("#submit");
var date = document.querySelector("#date");
var teamName = document.querySelector("#team-name");
var teamCaptain = document.querySelector("#captain");
var phoneNumber = document.querySelector("#phone");
var email = document.querySelector("#email");
var playerAmount = document.querySelector("#player-amount");
var newEvent = document.querySelector("#new-event");

//console.log(submitBtn);
//var locationOne = document.querySelector("#location-one").focus();
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  
  $('#startdate').val()
  //var locationTable = document.querySelector("#location-table");
  //locationTable.removeAttribute("class");
  date.value = "";
  teamName.value = "";
  teamCaptain.value = "";
  phoneNumber.value = "";
  email.value = "";
  playerAmount.value = "";


  // console.log(dateValue);
  // console.log(teamNameValue);
  // console.log(teamCaptainValue);
  // console.log(phoneNumberValue);
  // console.log(emailValue);
  
  // console.log(playerAmountValue);
  //addEventToMap("Slaughter Creek Fields 4",teamNameValue,teamCaptainValue,phoneNumberValue,emailValue,dateValue,playerAmountValue)
  // event.preventDefault();
  // create the event list/values
  // var eventHeader = document.createElement("h3");
  // eventHeader.appendChild(dateValue);
  // console.log(eventHeader);
  // newEvent.appendChild(eventHeader);

})

function setLocalStorage() {

  var teamName = document.querySelector("#team-name").value;
  var teamCaptain = document.querySelector("#captain").value;
  var playerAmount = document.querySelector("#player-amount").value;
  var phoneNumber = document.querySelector("#phone").value;
  var email = document.querySelector("#email").value;
  var date = document.querySelector("#date").value;

  localStorage.setItem("team name", teamName);
  localStorage.setItem("captain name", teamCaptain);
  localStorage.setItem("amount", playerAmount);
  localStorage.setItem("phone", phoneNumber);
  localStorage.setItem("email", JSON.stringify(email));
  localStorage.setItem("date", date);

  getLocalStorage();
}

function getLocalStorage() {

  var email = document.querySelector("#email").value;
  var item = localStorage.getItem("team name");
  console.log(item);

  var retrieve = document.getElementById("get");
  console.log(retrieve);
  retrieve.innerHTML = item;
  retrieve.classList = "card-header";
  

}

// create cell add to row
function createCell(cellValue, row) {
  var cell = document.createElement("td");
  cell.innerHTML = cellValue;
  row.appendChild(cell);
}

// creates new events, into our event storage
function addEventToMap(fieldName, teamName, teamCaptain, phoneNumber, email, date, players) {
  const locationDetails = { teamName: teamName, teamCaptain: teamCaptain, phoneNumber: phoneNumber, email: email, date: date, players:players};
  if (events.has(fieldName)) {
    events.get(fieldName).push(locationDetails);
  }
  else {
    events.set(fieldName, [locationDetails]);
  }
}
// calendar section end

