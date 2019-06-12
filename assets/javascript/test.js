const tracksTemplateSource = document.getElementById('tracks-template').innerHTML;
const tracksTemplate = Handlebars.compile(tracksTemplateSource);

const $tracks = $('#musicplay');

const getTopTracks = $.get('https://api.napster.com/v2.2/tracks/tra.5156528?apikey=NTEwNTk3OGUtNDQwYy00MzBiLTgyNzEtNDU0MjY0YTVjZmMy');

getTopTracks
  .then((response) => {
      console.log(response);
    $tracks.html(tracksTemplate(response));
  });