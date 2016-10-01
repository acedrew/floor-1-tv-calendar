import React from 'react';
import CurrentTime from './currentTime';

export default class TitleAndTime extends React.Component {
  render() {
    return(
      <div className="title-and-time">
        <h2 className="title center">Today's Events at The Edney</h2>
        <div className="center orange">
          <span className="currently uppercase">Currently</span>
          <CurrentTime UTCOffset="-4"/>
        </div>
      </div>
    )
  }
}
