import React, { Component } from 'react';
import GetEvents from './getEvents';
import TitleAndTime from './titleAndTime';

function getBOD() {
  let start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  return start.toISOString();
}

function getEOD() {
  let end = new Date();
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(999);
  return end.toISOString();
}


function makeGoogleCalendarURL(calID) {
  return `https://www.googleapis.com/calendar/v3/calendars/${calID}/events?singleEvents=true&orderBy=startTime&timeMin=${getBOD()}&timeMax=${getEOD()}&key=AIzaSyDFzoxhmCRgYGWBzxhjClogyoh0ibNlhPs`
}

const config = [
  {
    name: "Rooftop",
    spaces: [
      {
        url: "theedney.com_4172gjp6l679ntf1m5t94c3nls@group.calendar.google.com",
        name: "Rooftop Deck"
      }
    ]
  },
  {
    name: "Floor 5",
    spaces: [
      {
        url:  "theedney.com_lsgotg320507m2s8tnchqsd1v0@group.calendar.google.com",
        name: "Community Space"
      },
      {
        url:  "theedney.com_acrpuqqea0sus4irgf8m52466c@group.calendar.google.com",
        name: "Accelerator Space"
      },
      {
        url:  "theedney.com_ebmlbbh0qcu7u6dgdc98ti58k4@group.calendar.google.com",
        name: "Large Conference Room"
      },
      {
        url: "theedney.com_3s22k2kouob2co8kdt6gqkg14g@group.calendar.google.com",
        name: "Small Conference Room"
      }
    ]
  },
  {
    name: "Floor 3",
    spaces: [
      {
        url: "theedney.com_58b6jopvgat4f974mitp8fcn9k@group.calendar.google.com",
        name: "Floor 3 East"
      },
      {
        url: "theedney.com_am2ggtaf08u44vgrb2hqbtimmc@group.calendar.google.com",
        name: "Floor 3 West"
      }
    ]
  },
  {
    name: "Floor 1",
    spaces: [
      {
        url: "theedney.com_humeelae3o2gltq8gi7sdpu0js@group.calendar.google.com",
        name: "Floor 1 Lobby"
      }
    ]
  }
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = this.buildEmptyState();
  }
  buildEmptyState() {
    return {
      floors: config.map(floor =>{
        return {name: floor.name, events: []}
      })
    };
  }
  updateEvents(events, floorName){
    let floorUpdate = this.state.floors.map(floor => {
      if(floorName === floor.name) {
        if(floor.name === "Floor 1"){
          floor.arrowClass = "left-arrow";
        } else {
          floor.arrowClass = "up-arrow";
        }
        floor.events = floor.events.concat(events).sort((event1, event2) => {
          if(event1.startTime.getTime() > event2.startTime.getTime()) {
            return 1;
          } else if (event1.startTime.getTime() === event2.startTime.getTime()){
            return 0;
          } else {
            return -1;
          }
        }).filter(event => {
          if(event.hasOwnProperty("visibility") && event.visibility === "private") {
            return false;
          } else {
            return true;
          }
        });
      }
      return floor;
    });
    this.setState({floors: floorUpdate});
  }

  refreshData() {
    this.setState(this.buildEmptyState);
    var self = this;
    config.forEach(floor => {
      floor.spaces.forEach(space => {
        GetEvents(makeGoogleCalendarURL(space.url), space.name).then(function(events) {
          self.updateEvents(events, floor.name);
        });
      });
    });

  }

  componentWillMount() {
    console.log("willmount");
    this.refreshData();
    window.setInterval(function() {
      console.log("scheduled");
      this.refreshData();
    }.bind(this), 60*1000);
  }
  renderEvent(event) {
    return (
      <div key={event.id} className={event.class}>
        <p className="event-title">{event.summary}</p>
        <p className="event-location">{event.spaceName}</p>
        <p className="event-time">{event.start.time} - {event.end.time}</p>
      </div>
    )
  }
  renderFloor(floor) {
      if(floor.events.length > 0) {
        return (
            <div key={floor.name} className="grid set-height">
            <div className="la">
              <h2 className="event-space">
                <div className={floor.arrowClass}>
                ➤
                </div>
                {floor.name}
              </h2>
              {floor.events.map(event =>
                this.renderEvent(event)
              )
            }
            </div>
          </div>
        )
      }

  }

  render() {

    return (
      <div>
        <TitleAndTime/>
        <div className="side-padding">
          {this.state.floors.map((floor, index) =>
            this.renderFloor(floor)
          )}
        </div>
      </div>
    );
  }
}

export default App;
