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

const imageList = [img1, img2, img3, img4, img5, img6, img7, img8]

function encodeInputValue(value) {
  return value.replace(/ /g, "+");
}

function handleErrors(response) {
  if (!response.ok) {
    displayMessage("Request failed: " + response.statusText, true);
  }
  return response;
}

function parseJSON(response) {
  return response.json();
}

// function createVideoTag(src) {
//   var video = document.createElement("video");
//   video.autoplay = true;
//   video.src = src;
//   video.loop = true;
//   video.className = 'theGifs';
//   return video;
// }

// // OUR MODIFIED FUNCTION
// function createStillTag(src) {

//   var image = document.createElement("img");
//   image.src = src;

//   image.onclick = function () {
//     this.parentElement.removeChild(this);
//   };

//   return image;
// }

// function insertVideoTag(video) {
//   target.appendChild(video);
// }

// function deleteVideos() {
//   target.innerHTML = '';
// }

function getGifs(videos) {
  if (videos.data.length === 0) {
    displayMessage("No gifs", true);
  }
  for (var gif in videos.data) {
    let video_url = videos.data[gif].images.original.mp4
    console.log(video_url)
    // let video = createVideoTag(video_url);
    // insertVideoTag(video);

    let still_url = videos.data[gif].images["480w_still"].url;
    console.log(still_url)
    // let still = createStillTag(still_url);
    // insertVideoTag(still);
  }
}

function loadGifs(url) {
  fetch(url).then(handleErrors).then(parseJSON).then(function (videos) {
    console.log(videos);
    getGifs(videos);
    // displayLoader(false);
  }).catch(function (error) {
    // displayLoader(false);
    console.log(videos);
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
    console.log("images");
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
    console.log(url);
    loadGifs(url);
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
          />
          <textarea rows="1" cols="100" value={this.state.image && JSON.stringify(this.state.image)} disabled />

          <h3>Multiple Select</h3>
          <ImagePicker
            images={imageList.map((image, i) => ({ src: image, value: i }))}
            onPick={this.onPickImages.bind(this)}
            multiple
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

var api_key = "RvWFyDT9no5s24ctoMd0CIFRPiEwaVBG"
render(<Search />, document.getElementById("app"))
