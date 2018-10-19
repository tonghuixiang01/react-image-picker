import React, { Component } from 'react'
import { render } from 'react-dom'
import ImagePicker from './react-image-picker'
import { version } from 'punycode';


var imageList = [];  
// should this be part of the class state?
// but imageList needs to be referenced by outside functions

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

function getGifsFromJSON(videos) {
  // initialise an array of URLs
  let url_arr = [];
  if (videos.data.length === 0) {
    displayMessage("No gifs", true);
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


class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classimageList: [],  // list of imageURLs
      largeimage: '',  // legacy large background image for single image search
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
    this.setState({ images });  // changing the textbox
  }

  // Get initial image - silenced
  // componentDidMount() {
  //   this.getImage();
  // }
  
  // Get search value from input box on submit
  search(e) {
    e.preventDefault();  // do not search "search ..."
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
      displayMessage("Request failed: " + error, true);
    });

    this.setState({
      // largeimage: `https://source.unsplash.com/featured/?${search}`,
      classimageList: imageList  // does not seem to have any effect
    })
  }

  render() {
    const divStyle = {
      backgroundImage: `url(${this.state.largeimage})`
    }

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
