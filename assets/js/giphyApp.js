// app code for reading giphy
// John Webster
$(document).ready(function () {
// Globals

var allButtons = [
    "cats",
    "kittens",
    "dogs",
    "puppies",
    "bunnies",
    "cute"
];

var apiKey = "E86wu8MFEDRrDhlagTwJMtqUO52e5tkE";
var noGifs = 6;
// functions

// creates the buttons that user will press to find gifs
function createButtons() {
    // clear existing HTML
    $("#buttonsDiv").empty();
    for( var i=0; i < allButtons.length; i++){
        // create HTML
        var newButton = $("<button class='btn btn-primary myButton'>");
        // console.log(newButton);
        newButton.attr("data-value", allButtons[i]);
        newButton.text(allButtons[i]);
        
        // add to HTML
        $("#buttonsDiv").append(newButton);
    }
    // add click event
    $(".myButton").on("click", function() {
        var myValue = $(this).attr("data-value");
        getGif(myValue);
    });
}


// create AJAX call to get data from giphy and display results
function getGif(topic) {
    var myUrl = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + 
    "&q=" + topic + "&limit=" + noGifs + "&offset=0&lang=en";
    $.ajax({ url: myUrl, mode:'GET'}).then( function(result){
        console.log(result);
        // check to see if valid results
        if (result.meta.msg === "OK") {
            $("#gifBox").empty(); // get rid of previous gifs
            $("#gifBox").css("background", "black");  // reset background to black
            // Process the gifs
            for ( var i = 0; i < noGifs ; i++) {
                var newImg = $("<img src='" + result.data[i].images.fixed_height_still.url + "'>");
                newImg.attr("data-still", result.data[i].images.fixed_height_still.url);
                newImg.attr("data-moving", result.data[i].images.fixed_height.url);
                newImg.attr("data-motion", "still");
                var newGif = $("<div class='gifImage'>");
                newGif.append(newImg);
                
                // add rating information
                var newDiv = $("<div class='imgDiv'>");
                var imgBox = $("<h6>");
                imgBox.text("Rating: " + result.data[i].rating);
                // add favorites button
                var newButton = $("<button class='btn btn-dark favButton'>");
                newButton.text("Favorite");
                newButton.attr("data-value", topic);
                newDiv.append(imgBox).append(newButton);
                // append
                newGif.append(newDiv);
                // append 
                $("#gifBox").append(newGif);
            }
            // add event listeners on image to change from still to moving
            $(".gifImage").on("click", function (){
                var myImg = $(this).children("img");
                console.log(myImg);
                // toggle whether gif is moving or not
                if ( myImg.attr("data-motion") === "still") {
                    myImg.attr("data-motion","moving");
                    myImg.attr("src", myImg.attr("data-moving"));
                }
                else {
                    myImg.attr("data-motion","still");
                    myImg.attr("src", myImg.attr("data-still"));
                }

            });
            // add event listeners on favorites button
            
        } else {
            // bad data get, log but don't report to user
            console.log("Bad return from giphy");
            console.log(result);
        }
    });
}


createButtons();

// set event listener on the input form

}); // end document ready