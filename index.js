const YouTubeAPIURL='https://www.googleapis.com/youtube/v3/search';
const YouTubeAPIKey='AIzaSyBM6336kxCCw2JfhksBRaIzMPOgQMpXGo4';
const searchQuery = {
  term:""
};

function youtubeHTML(firstVideo){
    console.log("youtubeHTML Section");
    console.log(firstVideo.id.videoId);
    console.log(firstVideo.id.videoId);

    return `
        <div class='searchResultContainer-js'>
        <div class='imageContainer'>
            <iframe width="320" height="180" src="https://www.youtube.com/embed/${firstVideo.id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
            <a href="https://www.youtube.com/watch?v=${firstVideo.id.videoId}">    
                <p class='title'>${firstVideo.snippet.title}</p>
            </a>
            <p class='description'>${firstVideo.snippet.description}</p}
        </div>
    `;

};




function displayYoutubeResults(YTAPIResults){
    console.log(YTAPIResults);
    const firstVideo = YTAPIResults.items[0];
    console.log(firstVideo);
    console.log(firstVideo.id);
    $('.youtubeResults').html(youtubeHTML(firstVideo));
}


function searchYoutube(term){
    const query = {
        part: 'snippet',
        key: YouTubeAPIKey,
        q: term,
        pageToken: ""
      };
      console.log(query);
      $.getJSON(YouTubeAPIURL, query, displayYoutubeResults);
};




function master() {
    $('.submitButton').on('click',function (event){
        event.preventDefault();
        searchQuery.term = $('.searchBox').val();      
        $('.jsSearchQuery').val('');  
        console.log(searchQuery.term);
        searchYoutube(searchQuery.term);

//        searchGoogle(searchQuery.term);
//        searchYelp(searchQuery.term);


    });
};



$(master);