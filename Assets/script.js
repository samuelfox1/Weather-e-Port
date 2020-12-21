// wait to run js until html is loaded
$(document).ready(function () {

    console.log('linked!')
    var userInput = ''
    var btnBox = $('.button-box')
    var search = $('.search')
    var searchHistory = ['Tacoma, Washington', 'Seattle, Washington', 'Honolulu, Hawaii', 'Anaheim, California']

    var APIkey = '5fb601afb9ee3cc974379d932b3c5bea'

    var curCity = $('#city-name')
    var curTemp = $('#current-temp')
    var curHumidity = $('#current-humidity')
    var curWind = $('#current-wind')
    var curUv = $('#current-uv-index')

    function loadHistory() {
        btnBox.empty()
        if (searchHistory[0] !== null)
            for (let i = 0; i < searchHistory.length; i++) {
                btnBox.append($(`<button class="btn btn-outline-info my-2 my-sm-0 history" value="${searchHistory[i]}" type="submit">${searchHistory[i]}</button>`))
            }
    }


    // requestData()
    var requestData = function () {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${APIkey}`
        var queryURL5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&appid=${APIkey}`
        var coords = []

        $.get(queryURL).then(function (response) {

            curCity.text(response.name)
            curTemp.text(`Temp: ${response.main.temp} °F`)
            curHumidity.text(`Humidity: ${response.main.humidity} %`)
            curWind.text(`Wind: ${response.wind.speed} mph`)
            console.log(response)

            var lat = response.coord.lat
            var lon = response.coord.lon
            var queryURLuv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`
            $.get(queryURLuv).then(function (response) {
                curUv.text(`uv-index: ${String(response.value)}`)
            })
        })
        $.get(queryURL5Day).then(function (response) {
            var x = 2

            for (let i = 1; i < 6; i++) {

                $('#forecast-day-' + i).text(response.list[x].dt_txt)
                $('#forecast-temp-' + i).text(`Temp: ${response.list[x].main.temp} °F`)
                $('#forecast-humidity-' + i).text(`Humidity: ${response.list[x].main.humidity} %`)
                x = x + 8

                // $('#forecast-icon-i' + i).text('Icon ' + i)
            }


        })


    }

    function buildForecast() {

        for (let i = 1; i < 6; i++) {
            // $(".container").append($("<tr>", { class: "row time-block", id: i }))

            $("#forecast-container").append($("<div>", { class: "col-sm", id: 'day-' + i }))
            $('#day-' + i).append($('<div>', { class: "card", id: 'card-' + i }))
            $('#card-' + i).append($('<div>', { class: "card-body", id: "card-body-" + i }))
            $('#card-body-' + i).append($('<p>', { class: "card-title", id: "forecast-day-" + i }))
            $('#forecast-day-' + i).text('Day ' + i)
            $('#card-body-' + i).append($('<p>', { id: "forecast-icon-" + i }))
            $('#forecast-icon-' + i).text('Icon ' + i)
            $('#card-body-' + i).append($('<p>', { id: "forecast-temp-" + i }))
            $('#forecast-temp-' + i).text('Temp: ' + i)
            $('#card-body-' + i).append($('<p>', { id: "forecast-humidity-" + i }))
            $('#forecast-humidity-' + i).text('Humidity: ' + i)

        }

    }

    $('.search').on('click', function (event) {
        if ($(this).prev().val() !== '') {
            event.preventDefault(event)
            userInput = $(this).prev().val()
            $(this).prev().val('')
            searchHistory.push(userInput)
            console.log(searchHistory)
            loadHistory()
            requestData()
        }
    })

    $(document).on('click', '.history', function (event) {
        userInput = $(this).text()
        console.log(userInput)
        requestData(userInput)
    })

    $(document).on('click', '.clear', function (event) {
        event.preventDefault()
        searchHistory.pop()
        loadHistory()
    })


    loadHistory()
    buildForecast()

})
