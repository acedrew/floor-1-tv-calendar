import axios from 'axios';

export default function getEvents(url) {
    axios.get(url)
      .then(res => {
        const events = res.data.items.map(function(event) {
          let AMPM, endHours, startHours, endAMPM, startAMPM;
          let startTime = new Date(event.start.dateTime);
          let endTime = new Date(event.end.dateTime);
          let time = new Date();

          function pad(n) {
            return (n < 10) ? ("0" + n) : n;
          }

          function twentyfourtotwelve(hours) {

            if ( hours > 11 ){
              AMPM = "PM";
            } else {
              AMPM = "AM";
            }
            hours = hours === 12 ? 12 : hours % 12
            return [hours, AMPM];
          }
          [startHours, startAMPM] = twentyfourtotwelve(startTime.getHours());
          [endHours, endAMPM] = twentyfourtotwelve(endTime.getHours());

          if(startAMPM === endAMPM) {
            event.start.time = `${startHours}:${pad(startTime.getMinutes())}`;
            event.end.time = `${endHours}:${pad(endTime.getMinutes())} ${endAMPM}`;
          } else {
            event.start.time = `${startHours}:${pad(startTime.getMinutes())} ${startAMPM}`;
            event.end.time = `${endHours}:${pad(endTime.getMinutes())} ${endAMPM}`;
          }

          if (endTime.getTime() < time.getTime()) {
            event.class = "past";
          } else {
            event.class = "current";
          }
          return event;
        });
        return events;
      });
  }
