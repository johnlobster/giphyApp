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
    "minions",
    "cute"
];


var apiKey = "E86wu8MFEDRrDhlagTwJMtqUO52e5tkE";
var noGifs = 6; // show 6 gifs
// functions

// store and retrieve saved favorites
function saveFavorites () {
    localStorage.setItem("giphyFavorites", JSON.stringify($("#favoritesBox").html()));
    // console.log( "stored " + localStorage.getItem("giphyFavorites"));
}
function showFavorites () {
    if ((localStorage.getItem("giphyFavorites") !== "") && (localStorage.getItem("giphyFavorites") !== null)) {
        // console.log("read " + localStorage.getItem("giphyFavorites"));
        // change colors
        $("#favoritesHeader").css("background", "black");
        $("#favoritesHeader").find("h4").css("color", "white");
        $("#favoritesBox").css("background", "black");
        // put back the saved html
        $("#favoritesBox").html(JSON.parse(localStorage.getItem("giphyFavorites")));
        // add events to html
        addEvents();
    }
    
}

// add event listeners to images and favorite buttons
function addEvents(){
    // add event listeners on image to change from still to moving
    // attaching event listener to document to catch favorites as they are added
    // have to delete previous as it was adding them twice
    $(document).off("click", ".clickableImage");
    $(document).on("click", ".clickableImage", function () {
        // var myImg = $(this).children("img");
        var myImg = $(this);
        // console.log("clickable image" + myImg);
        // toggle whether gif is moving or not
        if (myImg.attr("data-motion") === "still") {
            myImg.attr("data-motion", "moving");
            myImg.attr("src", myImg.attr("data-moving"));
        }
        else {
            myImg.attr("data-motion", "still");
            myImg.attr("src", myImg.attr("data-still"));
        }

    });
    // add event listeners on favorites buttons, add favorites to bottom
    // clone the whole gif+text and add into the favorites box
    $(".favButton").on("click", function () {
        // button is what was clicked, grab the grandparent, this is what we will copy
        var myGif = $(this).parent().parent();
        // console.log( "myGif= " + myGif);
        // copy
        var newGif = myGif.clone();
        // change text on button
        var myButton = newGif.find("button");
        myButton.text("remove");
        myButton.removeClass("favButton");
        myButton.addClass("removeButton");
        // when has gifs in it, background needs to be black, and text white
        $("#favoritesHeader").css("background", "black");
        $("#favoritesHeader").find("h4").css("color", "white");
        $("#favoritesBox").css("background", "black");
        $("#favoritesBox").append(newGif);
        // save the favorites
        saveFavorites();
    });
    // add event listeners for remove button (remove first so don't get multiple events)
    // console.log("Add remove button event");
    $(document).off("click", ".removeButton");
    $(document).on("click", ".removeButton", function () {
    
        // console.log("remove button");
        $(this).parent().parent().remove();
        // have to save otherwise objects not removed from localStorage
        saveFavorites();
    });
    
}


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
        // console.log(result);
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
                newImg.addClass("clickableImage");
                var newGif = $("<div class='gifImage'>");
                newGif.append(newImg);
                // newGif.attr("id", )
                
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
            addEvents();
            

            
            
        } else {
            // bad data get, log but don't report to user
            console.log("Bad return from giphy");
            console.log(result);
        }
    });
}


createButtons();

// set event listener on the input form
$("#newButton").on("click", function (event) {
    event.preventDefault(); // stop it from posting
    var inputVal = $("#inputTextBox").val().trim();
    // don't add button if blank, or already present
    if (( inputVal !== "") && ( ! allButtons.includes(inputVal))) {
        allButtons.push(inputVal);
        createButtons();
    }
    // clear the input text box
    $("#inputTextBox").val("");
});

// showFavorites after all the events have been set up
showFavorites();

}); // end document ready