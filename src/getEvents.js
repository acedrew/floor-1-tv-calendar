import axios from 'axios';

export default function getEvents(url, spaceName) {
  let promise = new Promise( function(resolve){

  axios.get(url)
      .then(res => {
        const events = res.data.items.map(function(event) {
          event.spaceName = spaceName;
          let AMPM, endHours, startHours, endAMPM, startAMPM;
          event.startTime = new Date(event.start.dateTime);
          event.endTime = new Date(event.end.dateTime);
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
          [startHours, startAMPM] = twentyfourtotwelve(event.startTime.getHours());
          [endHours, endAMPM] = twentyfourtotwelve(event.endTime.getHours());

          if(startAMPM === endAMPM) {
            event.start.time = `${startHours}:${pad(event.startTime.getMinutes())}`;
            event.end.time = `${endHours}:${pad(event.endTime.getMinutes())} ${endAMPM}`;
          } else {
            event.start.time = `${startHours}:${pad(event.startTime.getMinutes())} ${startAMPM}`;
            event.end.time = `${endHours}:${pad(event.endTime.getMinutes())} ${endAMPM}`;
          }

          if (event.endTime.getTime() < time.getTime()) {
            event.class = "past";
          } else {
            event.class = "current";
          }
          return event;
        });
        resolve(events);
      });

  });
  return promise;
  }
