
Array.prototype.shuffle = function() {
   var i = this.length;
   while (--i) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = this[i];
      this[i] = this[j];
      this[j] = temp;
   }

   return this; // for convenience, in case we want a reference to the array
};

friends = new Array();

function get_single_status(user_id, callback) {

    friend_id = user_id;
    c = 0;
    index = 0;

    FB.api('/'+friend_id+'/statuses', function(response) {
	console.log(response);
	if (response && response.data && response.data.length && response.data.length > 0) {
	    chosen = "   ";
	    for (i = 0; i < response.data.length; i++) {
		    if (response.data[i].message) {
			story = response.data[i].message.toLowerCase();
			story = '"' + story + '"';
			if (Math.floor(Math.random() * 100) % (c + 1) == 0)
			    chosen = story;
			c += 1;
		    }
		    else {
			story = "";
		    }		   
	    }
	    
	    results = new Array();
	    c_i = 0;
	    new_c_i = 0;
	    for (i = 0; i < 4; i++) {
		new_c_i += 40;
		partial = chosen.substring(c_i, new_c_i);
		results[i] = partial;
		c_i = new_c_i;
	    }
	    console.log("HELEL");
	    console.log(results);
	    callback(results);
	}
    });
}

function get_friend_profile_pic(user_id, callback, data) {
    friend_id = user_id;
    FB.api('/'+friend_id+'/picture?type=large', function(response) {
	callback(response.data.url, data);
    });
}

function get_self(callback) {
    FB.api('/me', function(response) {
	console.log(response);
	callback(response.id);
    });
}

function get_friend_albums(user_id, callback) {
    friend_id = user_id;
    FB.api(friend_id+'/albums', function(response) {
	callback(response.data);
    });
}

function get_friend_photos(user_id, callback) {
    console.log("USER");
    console.log(user_id);
    get_friend_albums(user_id, function(albums) {
	console.log(albums);
	if (albums.length > 0) {
	    album_id = albums[0].id;
	    FB.api(album_id + '/photos', function(response) {
		console.log(response);
		results = new Array();
		for (i = 0; i < response.data.length; i++) {
		    //results[i] = "https://scontent-a-pao.xx.fbcdn.net/hphotos-prn1/67688_539080522787299_979200007_n.jpg";
		    //results[i] = response.data[i].picture;
		    str = response.data[i].picture;
		    end = 0;
		    n_b = 0;
		    for (j = 0; j < str.length; j++) {
			if (j == '/') n_b++;
			if (n_b >= 4) {
			    end = j;
			    break;
			}			
		    }

		    better = "https://scontent-a-pao.xx.fbcdn.net/hphotos-prn1/" + str.substring(end, str.length);
		    results[i] = better;
		}
		console.log(results);
		callback(results);
	    });
	}
    });
}
	
function post_on_wall(user_id, message){
	var body = message;
        id = user_id
	FB.api('/'+id+'/feed', 'post', { message: body }, function(response) {
  		if (!response || response.error) {
		    console.log(response.error);
    		    alert('Error occured');
  		} else {
    		    alert('Post ID: ' + response.id);
  		}
	});

}

function get_all_friends(callback){
    FB.api('/me/friends', function(response) {
	callback(response.data.shuffle());
    });
}

user_id = 0

// Init function which is called when user logs in.
function initialize() {
    console.log("Initializing...");
    FB.api('/me', function(response) {
	user_id = response.id;
	
	//GETTING THEIR PROFILE PICS
	get_all_friends(function(friends) {
	    console.log(friends);
	    get_single_status(friends[20], function(){});
	    //get_friend_photos(friends[20], function(){});
	});

	init();
	animate();
	
	get_all_friends(function(response){friends=response});
    });
}

// Get's the logged in user's picture and performs
// callback on the picture's url. 
function get_user_picture(callback) {
    FB.api(user_id + '/picture', function(response) {
	callback(response.data.url);
    });
}


window.fbAsyncInit = function() {

    FB.init({
	appId      : '1424417874443748', // App ID
	channelUrl : '', // Channel File
	read_friendlists : true,
	status     : true, // check login status
	cookie     : true, // enable cookies to allow the server to access the session
	xfbml      : true,  // parse XFBML
	
    });
    
    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(response) {
	// Here we specify what we do with the response anytime this event occurs. 
	if (response.status === 'connected') {
	    // The response object is returned with a status field that lets the app know the current
	    // login status of the person. In this case, we're handling the situation where they 
	    // have logged in to the app.

	    initialize();
	} else if (response.status === 'not_authorized') {
	    // In this case, the person is logged into Facebook, but not into the app, so we call
	    // FB.login() to prompt them to do so. 
	    // In real-life usage, you wouldn't want to immediately prompt someone to login 
	    // like this, for two reasons:
	    // (1) JavaScript created popup windows are blocked by most browsers unless they 
	    // result from direct interaction from people using the app (such as a mouse click)
	    // (2) it is a bad experience to be continually prompted to login upon page load.
	    FB.login(function(response) {}, {scope: 'email,user_likes,friends_photos,user_photos,publish_actions,publish_stream,read_stream'});
	} else {
	    // In this case, the person is not logged into Facebook, so we call the login() 
	    // function to prompt them to do so. Note that at this stage there is no indication
	    // of whether they are logged into the app. If they aren't then they'll see the Login
	    // dialog right after they log in to Facebook. 
	    // The same caveats as above apply to the FB.login() call here.
	    FB.login(function(response) {}, {scope: 'email,user_likes,friends_photos,user_photos,publish_actions,publish_stream,read_stream'});
	}
    });
};

// Load the SDK asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

function logout() {
    FB.logout(function(response) {
	alert("Logging out");
    });
}

