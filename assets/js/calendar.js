fetchCalendarData().then(events => {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
  });
  calendar.render();
});

async function fetchCalendarData() {
    // Define the API URL
    const apiUrl = 'https://profile.thelab.ms/api/events';
    
    // Make a GET request
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        var now = new Date(Date.now());
        var today = new Date(now.getFullYear(),now.getMonth(),now.getDate());

        return data.map(element => {
          const title = element.name;
          const start = new Date(element.start * 1000);
          const end = new Date(element.end * 1000);
          const durationDay = new Date(start.getFullYear(),start.getMonth(), start.getDate());
          const diffTime = Math.abs(durationDay - today);
          const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {title, start, end, daysUntil};
        }).sort((a,b) => {
            if (a.daysUntil > b.daysUntil) return 1;
            else if (b.daysUntil > a.daysUntil) return -1;
            else if (a.name > b.name) return -1;
            else if (b.name > a.name) return 1;
            return 0;
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
