const YouTubeAPIURL='https://www.googleapis.com/youtube/v3/search';
const YouTubeAPIKey='AIzaSyBM6336kxCCw2JfhksBRaIzMPOgQMpXGo4';
const YelpAPIURL='https://api.yelp.com/v3/businesses/search'
const YelpAPIKey='S1muYNYZsbpgz9sFQZEziIh-gIGQBP51SAHOszwWTsyLz25ediUv8aavlOV_UMBGuqZhOZxPN1MJpUK-fm8Adncy35F1CdZ9DLJxfjCiB_wbBGFsBb_MXfO_SyzaW3Yx'
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

//function displayYelpResults(YAPIResults){
//    console.log(YAPIResults);
//    const firstVideo = YTAPIResults.items[0];
//    console.log(firstVideo);
//    console.log(firstVideo.id);
//    $('.youtubeResults').html(youtubeHTML(firstVideo));
//}
function searchYelp(term){

    let YelpTerm=term+" doctor";
    let location="chicago";
    let YelpUrl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term="+YelpTerm+"&location="+location;

    $.ajax({
        url: YelpUrl,
        headers: {
            'Authorization':'Bearer '+YelpAPIKey,
            },
        method: 'GET',
        dataType: 'json',
        success: function(data){
            // Grab the results from the API JSON return
            console.log(data);
            var totalresults = data.total;
            // If our results are greater than 0, continue
            if (totalresults > 0){
                // Display a header on the page with the number of results
                $('.YelpResults').html('<h5>We discovered ' + totalresults + ' results!</h5>');
                // Itirate through the JSON array of 'businesses' which was returned by the API
                $.each(data.businesses, function(i, item) {
                    // Store each business's object in a variable
                    var id = item.id;
                    var alias = item.alias;
                    var phone = item.display_phone;
                    var image = item.image_url;
                    var name = item.name;
                    var rating = item.rating;
                    var reviewcount = item.review_count;
                    var address = item.location.address1;
                    var city = item.location.city;
                    var state = item.location.state;
                    var zipcode = item.location.zip_code;
                    // Append our result into our page
        //                console.log(phone);
                    $('.YelpResults').append('<div id="' + id + '" style="margin-top:50px;margin-bottom:50px;"><img src="' + image + '" style="width:200px;height:150px;"><br>We found <b>' + name + '</b> (' + alias + ')<br>Business ID: ' + id + '<br> Located at: ' + address + ' ' + city + ', ' + state + ' ' + zipcode + '<br>The phone number for this business is: ' + phone + '<br>This business has a rating of ' + rating + ' with ' + reviewcount + ' reviews.</div>');
                });
            } else {
                // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
                        console.log("failedtomatch");
                //           $('#results').append('<h5>We discovered no results!</h5>');
            }
        }
    });      


};


function getLocation(){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
//        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    console.log(position);
}



function master() {
    $('.js-searchForm').on('submit',function (event){
        event.preventDefault();
        searchQuery.term = $('.searchBox').val();      
        $('.jsSearchQuery').val('');  
        console.log(searchQuery.term);
        searchYoutube(searchQuery.term);
//        searchGoogle(searchQuery.term);
        searchYelp(searchQuery.term);
        getLocation();


    });
};



$(master);