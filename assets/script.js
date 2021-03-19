// wait to run js until html is loaded
$(document).ready(function () {

    console.log('linked!')
    var userInput = localStorage.getItem('WeatherSearch')
    var searchHistory = [userInput]
    var APIkey = '5fb601afb9ee3cc974379d932b3c5bea'

    
    //empty the contents of our div #button-bin
    //add a p tag to the card header with the search text for the current loaded weather data
    function loadHistory() {
        $('#button-bin').empty()
        $("#button-bin").append($("<p>", { class: "card-title", id: "search-history" }))
        $('#search-history').text("Search History")

        //if search history is available, load each search location as button displayed in "Search History" 
        if (searchHistory[0] !== null){
            for (let i = 0; i < searchHistory.length; i++) {
                $('#button-bin').append($("<button>", { class: "btn btn-outline-light my-2 my-sm-0 history", type: "submit", id: "button-" + i }))
                $('#button-' + i).text(searchHistory[i])
            }
        }
        
        //add abutton to remove the last searched item from "Search History"
        $("#button-bin").append($('<button>', { class: "btn btn-outline-danger my-2 my-sm-0 clear", type: "submit", id: "undo" }))
        $("#undo").text('Remove Last Search')

    }
    
    //Take the users search input and perform an API call with the location
    var requestData = function () {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=${APIkey}`
        var queryURL5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&appid=${APIkey}`
        var coords = []
        
        //only search if ther is search data available
        if (searchHistory[0] !== null){

            $.get(queryURL).then(function (response) {
                console.log(response)
                
                //store the coordinates from the first API call to use in the UV-Index api call
                var lat = response.coord.lat
                var lon = response.coord.lon
                var queryURLuv = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`
                
                //load the data for the "Today" weather card
                $('#city-header-text').text(userInput)
                $('#forecast-icon-0').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
                $('#forecast-temp-0').text(`Temp: ${response.main.temp} °F`)
                $('#forecast-humidity-0').text(`Humidity: ${response.main.humidity} %`)
                $('#forecast-wind-0').text(`Wind: ${response.wind.speed} mph`)
                
                //perform API call to request UV-Index of location
                //change background color of displayed UV-Index data to reflect danger level
                $.get(queryURLuv).then(function (response) {
                    var uvIndex = response.value 
                    $('#forecast-uv').text(`UV-index: ${String(uvIndex)}`)
                    if (uvIndex <= 2){
                        $('#card-footer-0').attr({class: "card-footer bg-success text-light text-center"})
                    }if (uvIndex > 1.99 && uvIndex < 5) {
                        $('#card-footer-0').attr({class: "card-footer bg-warning text-light text-center"})
                    }if (uvIndex > 4.99){
                        $('#card-footer-0').attr({class: "card-footer bg-danger text-light text-center"})
                        
                    }
                })
            })

            //perform API call for 5-day weather forecast 
            $.get(queryURL5Day).then(function (response) {
                var x = 4
                
                // display the forecast data on the page
                // i starts at one to reflect card with '#id-name-1' & stops at '#id-name-5'
                for (let i = 1; i < 6; i++) {
                    $('#forecast-icon-' + i).attr('src', `https://openweathermap.org/img/wn/${response.list[x].weather[0].icon}@2x.png`)
                    $('#forecast-temp-' + i).text(`Temp: ${response.list[x].main.temp} °F`)
                    $('#forecast-humidity-' + i).text(`Humidity: ${response.list[x].main.humidity} %`)
                    $('#forecast-wind-' + i).text(`Wind: ${response.list[x].wind.speed} mph`)

                    //5 day forcast reports data in 3 hour increments
                    //To load the same data for each day, x is incremented by 8 (8*3=24) to target the 24 hours later spot in array
                    x = x + 8
                }
                
                
            })
        }

    }
    
    //dynamically builds the page
    function buildPage() {
        //build history button card
        $("#forecast-container").append($("<div>", { class: "col-sm", id: "card-history" }))
        $('#card-history').append($('<div>', { class: "card-header bg-warning text-center", id: "card-header" }))
        $('#card-header').append($('<p>', { class: "text-dark", id: "city-header-text" }))
        $("#card-history").append($("<div>", { class: "card", id: "history-buttons" }))
        $("#history-buttons").append($("<div>", { class: "card-body d-flex flex-column text-center bg-dark text-light", id: "button-bin" }))

        //build current day and 5 day forecast cards
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
        //update custom attributes for 'today' card
        $("#card-body-0").attr('class', "card-body text-center bg-dark text-light")
        $("#card-header-0").attr('class', "card-header text-center bg-success text-light")
        $('#card-header-0').text(`Today (${moment().format('ddd')})`)
        $('#card-0').append($('<div>', { class: "card-footer text-light text-center", id: "card-footer-0"}))
        $('#card-footer-0').append($('<p>', { id: "forecast-uv"}))
    }
    
    //click event for search button
    $('.search').on('click', function (event) {
        if ($(this).prev().val() !== '') {
            //prevent page from reloading
            event.preventDefault(event)
            //save search text as userInput
            userInput = $(this).prev().val()
            //clear the text input field
            $(this).prev().val('')
            //update stored data in local storage
            localStorage.setItem('WeatherSearch', userInput)
            //if search history array is empty
            if (searchHistory[0] === null){
                //remove the "null" value
                searchHistory = []
                //push userInput contents into array
                searchHistory.push(userInput)
            }else{
                //if searchHistory has stored user searches already, add new search into the array
                searchHistory.push(userInput)
            }
            //update contents in "Search History" card with new searched item
            loadHistory()
            //load weather data for the new search
            requestData()
        }
    })
    
    //if saved item in "Search History" card is clicked
    $(document).on('click', '.history', function (event) {
        //update local storage with recent search location
        userInput = ($(this).text())
        localStorage.setItem('WeatherSearch', userInput)
        //load data with the location represented by the button text
        requestData()
    })
    
    //remove last search button in "Search History" card
    $(document).on('click', '.clear', function (event) {
        //prevent page from reloading
        event.preventDefault()
        //remove last item in searchHistory array
        searchHistory.pop()
        //reload "Search History" card to reflect contents in searchHistory array
        loadHistory()
    })
    
    //initialize page on startup
    buildPage()
    loadHistory()
    requestData()

})
