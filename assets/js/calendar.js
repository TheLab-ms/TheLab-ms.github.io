fetchCalendarData().then(data => {
    var e = document.getElementById("calendar");
    e.innerHTML = e.innerHTML || "";
    var locale = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    data.forEach(el => {
        e.innerHTML += `<div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
                <h2 class="mb-1">${el.name}</h5>
                <small>in ${el.daysUntil} days</small>
            </div>
            <p class="mb-1 ${el.membersOnly ? "text-bg-warning" : "text-bg-success"}">${el.membersOnly ? "Members Only" : "Open To The Public"}</p>
            <p class="mb-1">${el.start.toLocaleDateString("en-us",locale)} from ${String(el.start.getHours()).padStart(2,'0')}:${String(el.start.getMinutes()).padStart(2,'0')} until ${String(el.end.getHours()).padStart(2,'0')}:${String(el.end.getMinutes()).padStart(2,'0')}</p>
            <small>${el.description}</small>
        </div>`;
    });
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
        data.forEach(element => {
            var start = new Date(element.start * 1000);
            var end = new Date(element.end * 1000);
            var durationDay = new Date(start.getFullYear(),start.getMonth(), start.getDate());
            var diffTime = Math.abs(durationDay - today);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            element.start = start;
            element.end = end;
            element.daysUntil = diffDays;
        });
        data = data.sort((a,b) => {
            if (a.daysUntil > b.daysUntil) return 1;
            else if (b.daysUntil > a.daysUntil) return -1;
            else if (a.name > b.name) return -1;
            else if (b.name > a.name) return 1;
            return 0;
        });
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }