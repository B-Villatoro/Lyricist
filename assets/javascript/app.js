// initial testing
var favplaylist = [];

$("#add-music").on("click", function (event) {
    event.preventDefault();

    let lyricInput = $("#music-show").val().trim();
    let baseUrl = "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?format=json&q_lyrics=" + lyricInput +"&quorum_factor=.06&f_has_lyrics=1&s_track_rating=desc&apikey=2ff458e3e36ac3751209b898369ec5bd"
    $("#art-show").val("")
    $("#searchDump").empty();

    $.ajax({
        url: baseUrl,
        method: "GET",
    }).then(function (response) {
        let parsed = JSON.parse(response);
        let obj = parsed.message.body;
        for (let i = 0; i < obj.track_list.length; i++) {
            var newDiv = $("<div>");
            newDiv.append(
                newDiv.append(
                $("<p>").addClass("track").text(obj.track_list[i].track.track_name),
                    $("<p>").addClass("artist").text("Artist: " + obj.track_list[i].track.artist_name),
                     $("<button>").addClass("favorite").text( "💜").on("click", function () {
                        favplaylist.push( "<p>"+ "TRACK: " + obj.track_list[i].track.track_name + "<br>" + " ARTIST: "+ obj.track_list[i].track.artist_name)
                        console.log( "favplaylist" + obj.track_list[i].track.track_name    )
                        $("#lastplayed").html("Liked Tracks" + ("<p>" + favplaylist))
                    }   )
                )
            )
            newDiv.addClass("output");
            newDiv.attr("track", obj.track_list[i].track.track_name)
            newDiv.attr("artist", obj.track_list[i].track.artist_name)
            newDiv.attr("trId", obj.track_list[i].track.track_id)
            console.log(obj.track_list[i].track.track_id);
            $("#searchDump").append(newDiv)


	        }

    })

})


const tracksTemplateSource = document.getElementById('tracks-template').innerHTML;
const tracksTemplate = Handlebars.compile(tracksTemplateSource);
const $tracks = $('#musicplay');


function firstCall(title, artist, album) {
    console.log(title, artist, album);

    if (artist == null) {
        console.log("no artist and album");

        $.get("https://api.napster.com/v2.2/search?apikey=NTEwNTk3OGUtNDQwYy00MzBiLTgyNzEtNDU0MjY0YTVjZmMy&query=" + title+"&type=track",
          ).then(function (response) {
            console.log(response);
            let id = response.search.order[0];
            secondCall(id);
        })
    } else if (album == null) {
        console.log("no album ");

        $.get("https://api.napster.com/v2.2/search?apikey=NTEwNTk3OGUtNDQwYy00MzBiLTgyNzEtNDU0MjY0YTVjZmMy&query=" + title + "+" + artist+"&type=track",
           ).then(function (response) {
            console.log(response);
            let id = response.search.order[0];
            secondCall(id);
        })
    } else {
        console.log("no album ");

        $.get("https://api.napster.com/v2.2/search?apikey=NTEwNTk3OGUtNDQwYy00MzBiLTgyNzEtNDU0MjY0YTVjZmMy&query=" + title + "+" + artist + "+" + album+"&type=track",
        ).then(function (response) {
            console.log(response);
            let id = response.search.order[0];
            secondCall(id);
        })
    }
}


function secondCall(track) {
    console.log(track);
    $.ajax({
        url: "https://api.napster.com/v2.2/tracks/"+track+"?apikey=NTEwNTk3OGUtNDQwYy00MzBiLTgyNzEtNDU0MjY0YTVjZmMy",
        method: "GET"
    }).then(function (response) {
        $tracks.html(tracksTemplate(response));
    })
}

function showLyrics(track){
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?&track_id="+track+"&apikey=2ff458e3e36ac3751209b898369ec5bd",
        method: "GET",
    }).then(function (response){
        let parsed = JSON.parse(response);
        let lyrics = parsed.message.body.lyrics.lyrics_body;
        $("#lyricDiv").text(lyrics);
    })
}

$(document).on("click", ".output", function () {
    let track = $(this).attr("track");
    let artist = $(this).attr("artist");
    let trackId = $(this).attr("trId");
    firstCall(track, artist);
    showLyrics(trackId);
}) 

