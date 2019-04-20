console.log('hi this is firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBCrQFsGbYct8kiiOIdjg5EibnNuToXuPQ",
  authDomain: "gtcbc-clickcount.firebaseapp.com",
  databaseURL: "https://gtcbc-clickcount.firebaseio.com",
  projectId: "gtcbc-clickcount",
  storageBucket: "gtcbc-clickcount.appspot.com",
  messagingSenderId: "282263685473"
};
firebase.initializeApp(config);





var uiConfig = {

  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'https://tpgaviria.github.io/MeetUpApp/',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    }
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};




var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);








// if user signed in, change nav bar
var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function (user) {
  // Once authenticated, instantiate Firechat with the logged in user
  if (user) {
    var name;



    user.providerData.forEach(function (profile) {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);

      name = profile.displayName;
      profile = profile;
      console.log(profile);
    });



    $('#greeting').text('Hey, ' + name + '!');
    // $('#no-user').hide();
    // $('#signed-in').show();




    $('#sign-out').on('click', function () {

      firebase.auth().signOut().then(function () {
        $('#no-user').show();
        $('#signed-in').hide();
        console.log('signed out succesfully');
        // Sign-out successful.
      }).catch(function (error) {
        // An error happened.
        console.log('error signing out');
      })
    })
  }


  // User is signed in.
  else {
    // No user is signed in.
    console.log('no user signed in');
    $('#no-user').show();
    $('#signed-in').hide();
  }
});


// CHAT
function login() {
  // Log the user in via google
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(function (error) {
    console.log("Error authenticating user:", error);
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  // Once authenticated, instantiate Firechat with the logged in user
  if (user) {
    initChat(user);
  }
});

function initChat(user) {
  // Get a Firebase Database ref
  var chatRef = firebase.database().ref("chat");

  // Create a Firechat instance
  var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));

  // Set the Firechat user
  chat.setUser(user.uid, user.displayName);
}