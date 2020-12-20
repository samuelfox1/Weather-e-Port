// wait to run js until html is loaded
$(document).ready(function () {

    console.log('linked!')
    var search = $('.search')
    var searchHistory = ['test']
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


    loadHistory()



    function loadHistory() {
        $('.button-box').empty()
        for (let i = 0; i < searchHistory.length; i++) {
            $('.button-box').append($(`<button class="location-${i}">${searchHistory[i]}</button><br>`))
        }
    }

    $('.search').on('click', function (event) {

        event.preventDefault(event)
        userInput = $(this).prev().val()
        $(this).prev().val('')
        searchHistory.push(userInput)
        console.log(searchHistory)
        loadHistory()
    })

})
//link api and start linking to spots on page

//dynamically add buttons to page as a search history

//emoji pictures for weather conditions