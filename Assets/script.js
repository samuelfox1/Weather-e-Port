// wait to run js until html is loaded
$(document).ready(function () {

    console.log('linked!')
    var userInput = localStorage.getItem('WeatherSearch')
    var searchHistory = [userInput]
    var APIkey = '5fb601afb9ee3cc974379d932b3c5bea'

    
    //empty the contents of our div #button-bin
    //add a p tag to the card header with the search text
    function loadHistory() {
        $('#button-bin').empty()
        $("#button-bin").append($("<p>", { class: "card-title", id: "search-history" }))
        $('#search-history').text("Search History")

        if (searchHistory[0] === null) {
            return
        }
        if (searchHistory[0] !== null){
            for (let i = 0; i < searchHistory.length; i++) {
                $('#button-bin').append($("<button>", { class: "btn btn-outline-light my-2 my-sm-0 history", type: "submit", id: "button-" + i }))
                $('#button-' + i).text(searchHistory[i])
            }
        }
        $("#button-bin").append($('<button>', { class: "btn btn-outline-danger my-2 my-sm-0 clear", type: "submit", id: "undo" }))
        $("#undo").text('Remove Last Search')

    }


    var requestData = function () {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${APIkey}`
        var queryURL5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&appid=${APIkey}`
        var coords = []

        if (searchHistory[0] !== null){

            $.get(queryURL).then(function (response) {
                console.log(response)
                
                var lat = response.coord.lat
                var lon = response.coord.lon
                var queryURLuv = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`
                
                $('#city-header-text').text(userInput)
                $('#forecast-icon-0').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
                $('#forecast-temp-0').text(`Temp: ${response.main.temp} °F`)
                $('#forecast-humidity-0').text(`Humidity: ${response.main.humidity} %`)
                $('#forecast-wind-0').text(`Wind: ${response.wind.speed} mph`)
                
                $.get(queryURLuv).then(function (response) {
                    var uvIndex = response.value 
                    $('#forecast-uv').text(`uv-index: ${String(uvIndex)}`)
                    if (uvIndex <= 2){
                        $('#card-footer-0').attr({class: "card-footer bg-success text-light text-center"})
                    }if (uvIndex > 1.99 && uvIndex < 5) {
                        $('#card-footer-0').attr({class: "card-footer bg-warning text-light text-center"})
                    }if (uvIndex > 4.99){
                        $('#card-footer-0').attr({class: "card-footer bg-danger text-light text-center"})
                        
                    }
                })
            })
            $.get(queryURL5Day).then(function (response) {
                var x = 4
                
                for (let i = 1; i < 6; i++) {
                    // $('#forecast-day-' + i).text(response.list[x].dt_txt)
                    $('#forecast-icon-' + i).attr('src', `https://openweathermap.org/img/wn/${response.list[x].weather[0].icon}@2x.png`)
                    $('#forecast-temp-' + i).text(`Temp: ${response.list[x].main.temp} °F`)
                    $('#forecast-humidity-' + i).text(`Humidity: ${response.list[x].main.humidity} %`)
                    $('#forecast-wind-' + i).text(`Wind: ${response.list[x].wind.speed} mph`)
                    x = x + 8
                }
                
                
            })
        }

    }

    function buildPage() {
        //build history button container
        $("#forecast-container").append($("<div>", { class: "col-sm", id: "card-history" }))
        $('#card-history').append($('<div>', { class: "card-header bg-warning text-center", id: "card-header" }))
        $('#card-header').append($('<p>', { class: "text-dark", id: "city-header-text" }))
        $("#card-history").append($("<div>", { class: "card", id: "history-buttons" }))
        $("#history-buttons").append($("<div>", { class: "card-body d-flex flex-column text-center bg-dark text-light", id: "button-bin" }))

        //build current day and 5 day forecast 
        for (let i = 0; i < 6; i++) {
            $("#forecast-container").append($("<div>", { class: "col-sm", id: 'day-' + i }))
            $('#day-' + i).append($('<div>', { class: "card", id: 'card-' + i }))
            $('#card-' + i).append($('<div>', { class: "card-header bg-primary text-light text-center", id: "card-header-" + i }))
            $('#card-header-' + i).text(moment().add(i, 'days').format('dddd'))
            $('#card-' + i).append($('<div>', { class: "card-body text-center bg-secondary text-light", id: "card-body-" + i }))
            $('#card-body-' + i).append($('<p>', { class: "card-title text-center", id: "forecast-day-" + i }))
            $('#forecast-day-' + i).text(moment().add(i, 'days').format('MMM Do'))
            $('#card-body-' + i).append($('<img>', { id: "forecast-icon-" + i, alt: "weather icon" }))
            $('#card-body-' + i).append($('<p>', { id: "forecast-temp-" + i }))
            $('#card-body-' + i).append($('<p>', { id: "forecast-humidity-" + i }))
            $('#card-body-' + i).append($('<p>', { id: "forecast-wind-" + i }))
        }
        //update custom attributes for 'today' report
        $("#card-body-0").attr('class', "card-body text-center bg-dark text-light")
        $("#card-header-0").attr('class', "card-header text-center bg-success text-light")
        $('#card-header-0').text(`Today (${moment().format('ddd')})`)
        $('#card-0').append($('<div>', { class: "card-footer text-light text-center", id: "card-footer-0"}))
        $('#card-footer-0').append($('<p>', { id: "forecast-uv"}))
    }

    $('.search').on('click', function (event) {
        if ($(this).prev().val() !== '') {
            event.preventDefault(event)
            userInput = $(this).prev().val()
            $(this).prev().val('')
            localStorage.setItem('WeatherSearch', userInput)
            if (searchHistory[0] === null){
                searchHistory = []
                searchHistory.push(userInput)
                console.log('test')
            }else{
                searchHistory.push(userInput)
            }
            console.log(searchHistory)
            loadHistory()
            requestData()
        }
    })

    $(document).on('click', '.history', function (event) {
        userInput = ($(this).text())
        console.log(userInput)
        localStorage.setItem('WeatherSearch', userInput)
        requestData(userInput)
    })

    $(document).on('click', '.clear', function (event) {
        event.preventDefault()
        searchHistory.pop()
        loadHistory()
    })


    buildPage()
    loadHistory()
    requestData()

})
