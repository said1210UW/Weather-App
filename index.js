/**
 * Said Sheck
 * Section AD
 * Nov 4th 2021
 * The following webpage allows users to Search the weather
 * for their said areas at just a few types and a click of a button
 */
"use strict";
(function() {
  let baseURL = "http://api.openweathermap.org/data/2.5/weather?";
  const API_KEY = "&appid=0707705973b99a63c1ed9d933a9e30e7";
  window.addEventListener("load", init);

  /**
   * The following method innit allows to grab elements on the DOM an assign
   * these values in this app buttons eventlistners
   */
  function init() {
    // Enter after searched
    qs("#search-bar-container > button").addEventListener('click', function() {
      id("search-section").style.display = "none";
      id("weather-results").style.display = "flex";
      makeRequest();
    });

    // back button
    id("back-button").addEventListener('click', function() {
      id("search-section").style.display = "flex";
      id("weather-results").style.display = "none";
    });
  }

  /**
   *The following method makeRequest allows us to contact the
   * open-weathermap API allowing us to retieve information
   * about the weather in a said U.S zipcode area
   */
  function makeRequest() {
    // Get typed input
    let zipCode = buildQueryParam();
    let URL = baseURL + zipCode + API_KEY;
    // did this so we can make multiple searches w/o doing to much code

    // fetching
    fetch(URL)
      .then(statusCheck)
      .then(response => response.json())
      .then(weatherDisplayer)
      .catch(handleError);
  }

  /**
   * The following method takes information given by the open-weathermap API
   * an displays the given information for the User
   * @param {Promise Object} response - is a Promise Object retrived from the open-weathermap API
   * open-weathermap API
   * containing info about the weather in the said zipcode area
   */
  function weatherDisplayer(response) {
    displayCity(response); // Display City to Title
    displayWeather(response); // Display the Name of the Weather
    let createdImage = id("icon");
    displayIcon(response, createdImage);// Add a little Weather Icon
    displayTemp(response);
    displayDecsription(response);
  }

  /**
   * The Following method displayCity
   * displays the city of the searched Weather Area
   * @param {Promise Object} response - is a Promise Object retrived from the open-weathermap API
   * open-weathermap API containing info about the name of the City from the search zipcode
   */
  function displayCity(response) {
    let cityName = qs("nav > h2");
    cityName.textContent = response['name'];
  }

  /**
   * The Following method displayWeather
   * displays the weather of the searched Weather Area
   * @param {Promise Object} response - is a Promise Object retrived from the open-weathermap API
   * containing the weather from the search zipcode
   */
  function displayWeather(response) {
    let weatherName = qs("#weather-head > h3");
    let weatherinfo = response["weather"][0]["main"];
    weatherName.textContent = weatherinfo;
  }

  /**
   * The Following method displayIcon
   * adds the weather icon image for the given searched area
   * @param {Promise Object} response - is a Promise Object retrived from the open-weathermap API
   * containing the weather from the search zipcode
   * @param {<img>} createdImage is the blank given image tag and is looking to
   * be edited with the following method
   */
  function displayIcon(response, createdImage) {
    let iconURL = "http://openweathermap.org/img/wn/";
    let iconName = response["weather"][0]["icon"];
    iconURL = iconURL + iconName + ".png";
    createdImage.src = iconURL;
    createdImage.alt = "Image of " + response["weather"][0]["main"];
  }

  /**
   * The following method displayTemp displays the tempature recieved from the
   * open-weathermap API (default Kelvin (K)) in both Celsius and Fahrenheit
   * @param {Promise Object} response - is a Promise Object retrived from the open-weathermap API
   */
  function displayTemp(response) {
    // grab Kelvin Unit from API
    let kelvinTemp = response.main.temp;

    // convert the units
    id("fahrenheit").textContent = kelvintoFahrenheit(kelvinTemp);
    id("celsius").textContent = kelvintoCelsius(kelvinTemp);
  }

  /**
   * The following method displays for the user weather descirption for the said area
   * the following piece of information is retrived from the open-weathermap API
   * @param {Promise Object} response - is a Promise Object retrived from the open-weathermap API
   */
  function displayDecsription(response) {
    let description = response["weather"][0]["description"];
    qs("#weath-description > p").textContent = description;
  }

  /**
   * The following method retieves a given U.S Zipcode from the search box
   * @returns {int} zipInput- the user entered zipcode
   */
  function buildQueryParam() {
    let zipInput = qs("#search-bar-container > input").value;
    zipInput = "zip=" + zipInput;
    return zipInput;
  }

  /**
   * The following method displays to user that theres a specific error in the application
   * and asks the user to reload the page
   * @param {Promise Object} error - is a failed Promise Object containing a message explaining
   * the failure of the promise
   */
  function handleError(error) {
    id("weather-head").remove();
    id("weather-info-container").remove();

    qs("nav > h2").textContent = "Error";

    let errorMessage = document.createElement("h3");
    const STARTERROR = 24;
    const ENDERROR = 39;
    let message = "Error - " + (error["message"].substr(STARTERROR, ENDERROR)) +
                  " Reload the page";
    // hardcoded 404 response not sure
    errorMessage.textContent = (message);

    id("current-weather").appendChild(errorMessage);
  }

  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   *
   * @param {double} inputTemp  - the Input temp in Kelvin is use to convert
   * the given tempeture to Celsius
   * @returns {double} - the tempature in Celsius
   */
  function kelvintoCelsius(inputTemp) {
    const KELV_CONST = 273.15;
    let celsius = inputTemp - KELV_CONST;
    return (roundtwoDigit(celsius));
  }

  /**
   *
   * @param {double} inputTemp  - the Input temp in Kelvin is use to convert
   * the given tempeture to Fahrenheit
   * @returns {double} - the tempature in Fahrenheit
   */
  function kelvintoFahrenheit(inputTemp) {
    const celtofarRatio= 1.8;
    const celConstant = 32;
    let fahrenheit = (celtofarRatio * (kelvintoCelsius(inputTemp))) + celConstant;
    return (roundtwoDigit(fahrenheit));
  }

  /**
   * The following method after taking in an input double rounds the
   * double to a nice two digit decimal place
   * @param {double} inputNum - Number were are looking to round
   */
  function roundtwoDigit(inputNum) {
    const decimalMover = 100;
    return Math.round((inputNum + Number.EPSILON) * decimalMover) / decimalMover;
  }

})();