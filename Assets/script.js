console.log('linked!')

var curCity = $('#city-name')
var curTemp = $('#current-temp')
var curHumidity = $('#current-humidity')
var curWind = $('#current-wind')
var curUv = $('current-uv-index')

var forecast = []

for (let i = 0; i < 5; i++) {
    var object = {
        temp: `#day-${i}-temp`,
        humidity: `#day-${i}-humidity`
    }
    forecast.push(object)
}

console.log(forecast)



//link api and start linking to spots on page

//dynamically add buttons to page as a search history

//emoji pictures for weather conditions