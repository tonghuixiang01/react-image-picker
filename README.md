# Notes from Hui Kang

## ISSUES
The checkboxes persist after changing the queries (checkbox persistence) <BR>
Need to submit twice for the pictures to update (or submit once and then click once) <BR>

## TODO
Solve the issues above <BR>
Change the logo (ask Hui Xiang) <BR>
Break into 4 thumbnails align per row <BR>
Deregister from the list (require solving checkbox persistence) <BR>
Fetch when init (require solving checkbox persistence) <BR>
Create a new tab showing all the saved pictures: 'A dedicated page that the user can go to to view their tagged favourite images at any time' <BR>
'Different app states should ideally be accounted for with UI feedback to the user, e.g. errors, loading, etc' <BR>
'Add a “Fetch More” button displayed below the results that will fetch the next 8 image results for the current search'

### For people who do not know what `NPM` does
Install `npm` until you can `npm` on the command line. I think I `brew install npm` on my MacBook some time ago.
```
npm init -y
npm install
npm run build
npm start
```

![screenshot](https://raw.githubusercontent.com/tonghuikang/react-image-picker/master/docs/img/screenshot.png)

# The rest is by the original (?) repo creator - React Image Picker

The image picker is used for selecting single or multiple images from gallery.

[Live Demo](https://bagongkia.github.io/react-image-picker/)

## Features
- jQuery Free
- Single or multiple images selection
- Styling (...in progress)
- ...

## Installation
```
npm install react-image-picker
```

### Examples
![React Image Picker Demo](https://raw.githubusercontent.com/tonghuikang/react-image-picker/master/docs/img/react-image-picker-demo.jpg)

```javascript
//ES6
import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'

//import images from local
import img1 from './images/kitten/200.jpg'
import img2 from './images/kitten/201.jpg'
import img3 from './images/kitten/202.jpg'
import img4 from './images/kitten/203.jpg'

const imageList = [img1, img2, img3, img4]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null
    }
    this.onPick = this.onPick.bind(this)
  }

  onPick(image) {
    this.setState({image})
  }

  render() {
    return (
      <div>
        <ImagePicker 
          images={imageList.map((image, i) => ({src: image, value: i}))}
          onPick={this.onPick}
        />
        <button type="button" onClick={() => console.log(this.state.image)}>OK</button>
      </div>
    )
  }
}

export default App
```

## License

React-Image-Picker is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
