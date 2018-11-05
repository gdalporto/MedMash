const YouTubeAPIURL='https://www.googleapis.com/youtube/v3/search';
const YouTubeAPIKey='AIzaSyBM6336kxCCw2JfhksBRaIzMPOgQMpXGo4';
const YelpAPIURL='https://api.yelp.com/v3/businesses/search'
const YelpAPIKey='S1muYNYZsbpgz9sFQZEziIh-gIGQBP51SAHOszwWTsyLz25ediUv8aavlOV_UMBGuqZhOZxPN1MJpUK-fm8Adncy35F1CdZ9DLJxfjCiB_wbBGFsBb_MXfO_SyzaW3Yx'
const ipstackKey='7807523ccfdad212f406e0cb37d4be5a'
const ipstackURL='http://api.ipstack.com/'
const STORE = {
    searchQuery:"",
    location:"pukeville"
}

// ---------- YouTube Code ------------------------------

function youtubeHTML(videos,term, numVideos){
// present the data in the DOM

    let i=0;
    let k=0;
    let displayNum=3;
    console.log("youtubeHTML Section");
    console.log(videos);
    console.log(term);

//ARIA-Live setting to visible, present title.
    $('.youtubeResults').prop('hidden',false).html(
        `<div class='YTResultsContainer'>
                <h2 class="YT Response Title">Top ${displayNum} ${STORE.searchQuery} treatment videos on YouTube</h2>
        </div>`);

// iterate through the videos until three have been presented.

        while(i<numVideos){
            if(videos[i].id.kind == "youtube#video"){
                $('.YTResultsContainer').append(
                    `<div class="eachYTResult">
                        <div class='YTimageContainer'>
                            <iframe width="320" height="180" src="https://www.youtube.com/embed/${videos[i].id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                        </div>
                            <a href="https://www.youtube.com/watch?v=${videos[i].id.videoId}">    
                                <p class='YTtitle'>${videos[i].snippet.title}</p>
                            </a>
                            <p class='YTdescription'>${videos[i].snippet.description}</p>
                        
                    </div>`);
                    k=k+1;
                    if(k==displayNum){
                        break;
                    };        
            }
            i++
        }    
    

    for(let i=0; i<=3; i++) {

    }

};


function displayYoutubeResults(YTAPIResults){
// collect and organize data before presentation
    console.log(YTAPIResults);
    let numVideos=YTAPIResults.items.length;
    console.log(`number of videos: ${numVideos}`);
    let term=STORE.searchQuery;
    console.log(`term is ${term}`);
    youtubeHTML(YTAPIResults.items, term, numVideos);

}


function searchYoutube(term){
// use JSON to hit the youtube APIs and collect response data, then pass to the display section.

    const query = {
        part: 'snippet',
        key: YouTubeAPIKey,
        q: term+" treatment",
        pageToken: ""
      };
//      console.log(query);
      $.getJSON(YouTubeAPIURL, query, displayYoutubeResults);
//  can refactor with .ajax to use error handling.
};

// ------------ YELP CODE ----------------------------

function yelpHTMLFailed(error){
// present this information if APIs fail in some way.

    $('.yelpResults').prop('hidden',false).html(`<div class='yelpResultsContainer'>Error: ${error}</div>`);
}


function yelpHeader(numDisplay,term) {
// render the yelp header in the dom

   return   `<div class="yelpHeader">
                <h2>Here are the top ${numDisplay} local physicians for ${term}!</h2>
            </div>`
}

function yelpHTML (data, numDisplay, term){

// render the detailed yelp business data in the DOM

    let item=data.businesses;    
    numDisplay=3;
    // Create a container

    $('.yelpResults').prop('hidden',false).html("<div class='yelpResultsContainer'></div>");
    
    
    // Display a header on the page with the number of results
    $('.yelpResultsContainer').html(yelpHeader(numDisplay,term));

    // Itirate through the JSON array of 'businesses' which was returned by the API
    
    for(let i=0;i<=numDisplay-1;i++) {
        var id = item[i].id;
        var alias = item[i].alias;
        var phone = item[i].display_phone;
        var image = item[i].image_url;
        var name = item[i].name;
        var rating = item[i].rating;
        var reviewcount = item[i].review_count;
        var address = item[i].location.address1;
        var city = item[i].location.city;
        var state = item[i].location.state;
        var zipcode = item[i].location.zip_code;
    // Append our result into our page

        $('.yelpResultsContainer').append( 
        `<div id="${id}" class="eachYelpResult">
            <ul>
                <li> <img class="yelpImage" src="${image}" alt="Picture of ${name}"></li>
                <li class="yelpName"> <span class="nameLabel">Name:</span> ${name} </li>
                <li class="yelpRating">Star rating: ${rating} with ${reviewcount} reviews.</li>
                <li class="yelpAddress"> Located at: ${address} ${city} ${state} ${zipcode}</li>
                <li class="yelpPhone> The phone number for this business is: ${phone}</li>
            </ul>
        </div>')`);
    }
}; 





function searchYelp(term,location){

// use ajax to hit the yelp API and retrieve matching businesses / doctors

    let YelpTerm=term+" doctor";
    console.log(`YelpTerm is ${YelpTerm}`);
//    let location="chicago";
    let YelpUrl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term="+YelpTerm+"&location="+location;
    let i=0;

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
            let totalResults=data.total;
            let numDisplay = Math.min(data.businesses.length, 3);
            console.log(numDisplay);
            // If our results are greater than 0, continue
            if (numDisplay > 0){
                //Display Yelp search results
                yelpHTML(data, numDisplay, term);
            }
                else {
                // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
                    console.log("failedtomatch");
                    let error="No Results";
                    yelpHTMLFailed(error);
                //           $('#results').append('<h5>We discovered no results!</h5>');
            };
        },
        error: function(a,b,c){
            console.log(a,b,c);
            yelpHTMLFailed(c);
            //INSERT ERROR MESSAGE



        }
    });      


};

function youSearchedFor(term){
// present the search term in the DOM

    $('.yourSearchTerm').html(`Results for "${term}"`);
};


function displayLocation(city,state){
// display location in the DOM

    $('.location').html(`<p>Your location is ${city}, ${state}`);
};

function getLocation(ip) {
// this API takes a user's IP address and returns approximate geo location

    $.ajax({
        url: 'https://extreme-ip-lookup.com/json/'+ip,
        method: 'GET',
        dataType: 'json',
        success: function(data){
            displayLocation(data.city, data.region);
            STORE.location=data.city+', '+data.region;
        }
    })

};

function getIP(){
// this API retrieves the user's IP address
    $.ajax({
        url: 'https://api.ipify.org?format=json',
        method: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data.ip);
            getLocation(data.ip);
            let ip=data.ip;
            console.log(`inside routine ${ip}`);
            
        }
    });

}


function master() {

// get and display user location
    getIP();

// Implement autocomplete function for 5K+ health conditions

    new Def.Autocompleter.Search('condition','https://clinicaltables.nlm.nih.gov/api/conditions/v3/search');


// Wait for user to submit search query

    $('.js-searchForm').on('submit',function (event){
        event.preventDefault();
        console.log (`after click ${STORE.location}`);
        STORE.searchQuery = $('.searchBox').val();      
        $('.searchBox').val('');  
        console.log(`Search Query is ${STORE.searchQuery}`);

// Display search term
        youSearchedFor(STORE.searchQuery);

// Get videos on treatment options from YoutTube
        searchYoutube(STORE.searchQuery);

// Get local doctors and reviews from Yelp 
        searchYelp(STORE.searchQuery, STORE.location);
    });
};


$(master);