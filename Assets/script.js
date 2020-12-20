// wait to run js until html is loaded
$(document).ready(function () {

    console.log('linked!')
    var userInput = ''
    var btnBox = $('.button-box')
    var search = $('.search')
    var searchHistory = ['Tacoma, Washington', 'Seattle, Washington', 'Hawaii', 'Anaheim, California']

    var curCity = $('#city-name')
    var curTemp = $('#current-temp')
    var curHumidity = $('#current-humidity')
    var curWind = $('#current-wind')
    var curUv = $('#current-uv-index')

    function loadHistory() {
        btnBox.empty()
        if (searchHistory[0] !== null)
            for (let i = 0; i < searchHistory.length; i++) {
                btnBox.append($(`<button class="btn history" value="${searchHistory[i]}" type="submit">${searchHistory[i]}</button>`))
            }
    }


    // requestData()
    var requestData = function () {
        var coords = []

        var APIkey = '5fb601afb9ee3cc974379d932b3c5bea'
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${APIkey}`
        $.get(queryURL).then(function (response) {
            console.log(userInput)
            console.log(response)
            console.log(response.name)
            curCity.text(response.name)
            curTemp.text(`Temp: ${response.main.temp}°F`)
            curHumidity.text(`humidity: ${response.main.humidity}%`)
            curWind.text(`wind: ${response.wind.speed} mph`)

            var lat = response.coord.lat
            var lon = response.coord.lon
            var queryURLuv = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`
            $.get(queryURLuv).then(function (response) {
                console.log(String(response.value))
                curUv.text(`uv-index: ${String(response.value)}`)
            })
        })
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
        requestData(userInput)
    })

    $(document).on('click', '.clear', function (event) {
        searchHistory.pop()
        loadHistory()
    })

    loadHistory()
})
