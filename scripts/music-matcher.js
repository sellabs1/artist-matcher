/* 
	Author: Bryce Sellars.
	Date: 02/18/2015

	Uses .getsimilar API from Last.FM to match the user with artists based on their input 
*/

var options = options || {};

(function(options, $){

	options.getSimilarArtists = function(){
		
		var listWrap = $(".list-wrap");
		var artistName = $(".artist-input").val();
		var numResults = $("#num-results").val();
		var listItems = [];

		var urlString = options.urlStringBuilder(artistName, numResults);

		//Empty current list before populating .list-wrap 
		listWrap.children().empty();

		if (urlString == false) {
			$("<h5>Be sure to enter the artist's name, and how many results you want</h5>").appendTo(listWrap).hide().fadeIn();
		}
		//If both form fields are filled out, execute ajax call
		else {
			$.getJSON(urlString).success(function( data ) {

				var jsonObj = data;

				//If an error is returned
				if (jsonObj["error"]) {
					$("<h5>" + jsonObj["message"] + "</h5>").hide().appendTo(listWrap).fadeIn();
				}
				else {
					var artist = jsonObj["similarartists"]["artist"];
					//If more than one match is requested
					if ($.type(artist) === 'array'){
						//Loop through array and pull the name and last.fm url for each artist
						$.each(artist, function(key){
							listItems.push("<li><a href=http://"+ artist[key]["url"] +">" + artist[key]["name"] + "</a></li>");
						});
					}
					else {
						//If only one match is requested
						listItems.push("<li><a href=http://"+ artist["url"] +">" + artist["name"] + "</a></li>");
					}	
				}

				//Populate .list-wrap with the listItems array 
				$( "<ul/>", {
		    		html: listItems.join( "" )
		  		}).hide().appendTo($(".list-wrap")).fadeIn();

  				//scroll to the results 
	  		    $('html, body').animate({
			        scrollTop: $("#search-results").offset().top
			    });	
			})
			//Executed if the ajax call fails
			.error(function(){
				$("<h5>Error! Try again.</h5>").appendTo(listWrap).hide().fadeIn();
			});
		}
	};

	options.urlStringBuilder = function(artistName, numResults){
		//If any of the form fields haven't been filled in
		if (artistName == "" || numResults == null) {
			return false;
		}
		//Builds the url string using the passed in parameters 
		else {
			var urlString = encodeURI("http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" 
				+ artistName + "&api_key=2b52d1b2a46303a9782cec01c3db6ef0&limit=" 
					+ numResults + "&format=json");
			
			return urlString;
		}
	};

})(options, jQuery);

