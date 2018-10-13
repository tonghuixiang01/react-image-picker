import React, { Component } from 'react'
import { render } from 'react-dom'
import ImagePicker from './react-image-picker'

import img1 from './assets/images/kitten/200.jpg'
import img2 from './assets/images/kitten/201.jpg'
import img3 from './assets/images/kitten/202.jpg'
import img4 from './assets/images/kitten/203.jpg'
import img8 from './assets/images/kitten/200.jpg'
import img7 from './assets/images/kitten/201.jpg'
import img6 from './assets/images/kitten/202.jpg'
import img5 from './assets/images/kitten/203.jpg'
import { version } from 'punycode';

var imageList = [];
// external URLs also work as well
console.log("inital imageList");
console.log(imageList);

function encodeInputValue(value) {
  // making text into argument in the URL
  return value.replace(/ /g, "+");
}

function handleErrors(response) {
  if (!response.ok) {
    displayMessage("Request failed: " + response.statusText, true);
  }
  return response;
}

function parseJSON(response) {
  // this needs to be a function because ...
  return response.json();
}

function getGifs(videos) {
  // initialise an array of URLs
  let url_arr = [];
  if (videos.data.length === 0) {
    displayMessage("No gifs", true);
    return url_arr  // return empty array
  }
  for (var gif in videos.data) {
    let video_url = videos.data[gif].images.original.mp4;
    // GIPHY is meant for gifs, so KIV
    // console.log(video_url);

    let still_url = videos.data[gif].images["480w_still"].url;
    // console.log(still_url);
    url_arr.push(still_url);
  }
  return url_arr  // return an array of URLs
}

function loadGifs(url) {
  fetch(url).then(handleErrors).then(parseJSON).then(function (videos) {
    // when the URLs is fetch, error handled, JSON parsed
    console.log(videos);
    // receive array of URL from function
    imageList = getGifs(videos);  // update the imageList
    console.log("IMAGELIST");
    console.log(imageList);
    ImagePicker.images;

  }).catch(function (error) {
    displayMessage("Request failed: " + error, true);
  });
}


class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      image: null,
      images: []
    }

    this.search = this.search.bind(this);
  }

  // when an image (from single select) is selected
  onPickImage(image) {
    this.setState({ image })
  }

  // when an image (from multiple select) is selected
  onPickImages(images) {
    // send saved state to firebase
    console.log("image selected");
    console.log(images);  // apparently it does not tell us the changes
    this.setState({ images });
  }

  // Get initial image
  componentDidMount() {
    this.getImage();
  }

  // Get search value from input box on submit
  search(e) {
    e.preventDefault();
    this.getImage(this.refs.search.value);
  }

  // Set image state to the search value
  getImage(search = 'nature') {
    let url = "https://api.giphy.com/v1/gifs/search?q=" + encodeInputValue(search) + "&api_key=" + api_key + "&limit=8";
    console.log("API url - " + url);
    loadGifs(url);
    // updating of imageList will not be done here because it isn't done
    this.setState({
      image: `https://source.unsplash.com/featured/?${search}`
    })
  }

  render() {
    const divStyle = {
      backgroundImage: `url(${this.state.image})`
    }

    // Set `search__results` bg image to the image url
    return (
      <div className="search">

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

        <div>
          <form onSubmit={this.search}>
            <input className="search__input" type="text" placeholder="search..." ref="search" />
          </form>
          <div style={divStyle} className="search__results">
          </div>
        </div>
      </div>
    )
  }
}

const api_key = "RvWFyDT9no5s24ctoMd0CIFRPiEwaVBG";
render(<Search />, document.getElementById("app"))
