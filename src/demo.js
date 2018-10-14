import React, { Component } from 'react'
import { render } from 'react-dom'
import ImagePicker from './react-image-picker'
import { version } from 'punycode';


// ISSUES
// The checkboxes persist after changing the queries (checkbox persistence)
// Need to submit twice for the pictures to update, 
// (or submit once and then click once)

// TODO
// Solve the issues above
// Change the logo (ask Hui Xiang)
// Deregister from the list (require solving checkbox persistence)
// Fetch when init (require solving checkbox persistence)
// Create a new tab showing all the saved pictures: '''A dedicated page that
//// the user can go to to view their tagged favourite images at any time'''


// '''Different app states should ideally be accounted for with 
//// UI feedback to the user, e.g. errors, loading, etc'''
// '''Add a “Fetch More” button displayed below the results 
//// that will fetch the next 8 image results for the current search'''


////////////////////////////////////////////////////////////
////////////////////// FIREBASE SETUP //////////////////////
////////////////////////////////////////////////////////////

var config = {
  apiKey: "AIzaSyD1CrQlokN6OPq4AGVIcRnqIzm7SyYi4WM",
  authDomain: "botbot-image.firebaseapp.com",
  databaseURL: "https://botbot-image.firebaseio.com",
  projectId: "botbot-image",
  storageBucket: "botbot-image.appspot.com",
  messagingSenderId: "35197838184"
};
firebase.initializeApp(config);


var databaseMonitor = firebase.database().ref('images/');  // create reference 
databaseMonitor.on('value', function (snapshot) {
  // whenever there is a new value
  console.log(snapshot.val());
  let d = new Date();
  console.log("update detected : " + d.getTime());
});


var databaseViewOnce = firebase.database().ref('images/');
databaseViewOnce.once('value').then(function (snapshot) {
  console.log("databaseViewOnce");
  console.log(snapshot.val());
})  // unused for now


function writeUserData(imageUrl) {
  // given imageUrl, write to firebase the imageUrl and the time 
  let d = new Date();  // to get unix time
  let imageUrl_short = imageUrl.split("/").slice(-2)[0].split(".")[0];  // get unique ID
  firebase.database().ref('images/' + imageUrl_short).set({
    URL: imageUrl,
    timeAdded: d.getTime()
  });
  console.log("update written : " + d.getTime());
}


// writeUserData("https://media0.giphy.com/media/WXB88TeARFVvi/480w_s.jpg");
// writeUserData("https://media2.giphy.com/media/3o6Zt481isNVuQI1l6/480w_s.jpg");
// writeUserData("https://media1.giphy.com/media/JIX9t2j0ZTN9S/480w_s.jpg");
// writeUserData("https://media4.giphy.com/media/mlvseq9yvZhba/480w_s.jpg");
// writeUserData("https://media2.giphy.com/media/nNxT5qXR02FOM/480w_s.jpg");
// writeUserData("https://media3.giphy.com/media/1iu8uG2cjYFZS6wTxv/480w_s.jpg");
// writeUserData("https://media4.giphy.com/media/33OrjzUFwkwEg/480w_s.jpg");
// writeUserData("https://media1.giphy.com/media/8vQSQ3cNXuDGo/480w_s.jpg");


//////////////////////////////////////////////////////////////////
////////////////////// API PROCESSING SETUP //////////////////////
//////////////////////////////////////////////////////////////////

var imageList = [];
// should this be part of the class state?
// but imageList needs to be referenced by outside functions

function encodeInputValue(value) {
  // making text into argument in the URL
  return value.replace(/ /g, "+");
}

function handleErrors(response) {
  if (!response.ok) {
    console.error("Request failed: " + response.statusText, true);
  }
  return response;
}

function parseJSON(response) {
  // this needs to be a function because ...
  return response.json();
}

function getGifsFromJSON(videos) {
  // initialise an array of URLs
  let url_arr = [];
  if (videos.data.length === 0) {
    console.warn("No gifs", true);
    imageList = [];  // set imageList to None, but there is error
  }
  for (var gif in videos.data) {
    let video_url = videos.data[gif].images.original.mp4;
    // GIPHY is meant for gifs, so KIV
    // console.log(video_url);

    let still_url = videos.data[gif].images["480w_still"].url;
    // console.log(still_url);
    url_arr.push(still_url);
  }
  imageList = url_arr;
  return url_arr;
}

/////////////////////////////////////////////////////////////
////////////////////// COMPONENT SETUP //////////////////////
/////////////////////////////////////////////////////////////

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classimageList: [],  // list of imageURLs
      image: null,  // meant for the text box
      images: [],  // meant for the text box
    }

    this.search = this.search.bind(this);
  }

  // when an image (from single select) is selected
  onPickImage(image) {
    this.setState({ image });  // changing the textbox
  }

  // when an image (from multiple select) is selected
  onPickImages(images) {
    // send saved state to firebase
    console.log("image selected");
    console.log(images);  // apparently it does not tell us the changes
    // therefore we update everything 
    // could be more efficient, however
    for (let x in images) {
      console.log(images[x].src);
      writeUserData(images[x].src);
    }
    this.setState({ images });  // changing the textbox
  }

  // get search value from input box on submit
  search(e) {
    this.setState({
      classimageList: [],  // list of imageURLs
      image: null,  // meant for the text box
      images: [],  // meant for the text box
    })
    // new search should reset checkboxes
    e.preventDefault();  // do not search "search ..." ?
    this.getImage(this.refs.search.value);
  }

  // Set image state to the search value
  getImage(search = 'nature') {
    let url = "https://api.giphy.com/v1/gifs/search?q=" + encodeInputValue(search) + "&api_key=" + api_key + "&limit=8";
    console.log("API url - " + url);

    let results = [];
    fetch(url).then(handleErrors).then(parseJSON).then(function (videos) {
      // when the URLs is fetch, error handled, JSON parsed
      console.log(videos);
      imageList = getGifsFromJSON(videos);  // update imageList in the function
      console.log(imageList);  // the imageList prints correctly

    }).catch(function (error) {
      console.error("Request failed: " + error, true);
    });

    this.setState({
      // these are unnecessary, but need to setState for pics to update
      // I can't put this in inside other functions, "this" will cause error
      classimageList: [],  // list of imageURLs
      image: null,  // meant for the text box
      images: [],  // meant for the text box
    })
  }

  render() {

    // Set `search__results` bg image to the image url
    return (
      <div>
        <div>
          <form onSubmit={this.search}>
            <input className="input" type="text" placeholder="search..." ref="search" />
          </form>
        </div>

        <div>
          <h3>Single Select</h3>
          <ImagePicker
            images={imageList.map((image, i) => ({ src: image, value: i }))}
            onPick={this.onPickImage.bind(this)}
            multiple={false}
          />
          <textarea rows="1" cols="100" value={this.state.image && JSON.stringify(this.state.image)} disabled />

          <h3>Multiple Select</h3>
          <ImagePicker
            images={imageList.map((image, i) => ({ src: image, value: i }))}
            onPick={this.onPickImages.bind(this)}
            multiple={true}
          />
          <textarea rows="8" cols="100" value={this.state.images && JSON.stringify(this.state.images)} disabled />
        </div>
      </div>
    )
  }
}

const api_key = "RvWFyDT9no5s24ctoMd0CIFRPiEwaVBG";
render(<Search />, document.getElementById("app"))
