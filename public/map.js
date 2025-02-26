bus_markers = []
bus_routes = []

async function buses() {
    const response = await fetch("/move/data/vehicles", {
        method: "POST",
    });
    const data = await response.json();

    for (const marker of bus_markers) {
        marker.remove()
    }

    for (const bus of data['gmt']) {
        bus_markers.push(L.marker([bus.lat, bus.lon], {icon: gmtbus}).addTo(map))
    }
    for (const bus of data['cat']) {
        bus_markers.push(L.marker([bus.lat, bus.lon], {icon: catbus}).addTo(map))
    }
}

async function arrivals() {
    const response = await fetch("/move/data/arrivals", {
        method: "POST",
    });
    const data = await response.json();

    table = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Bus Stop</th>
                    <th>Est. Arrival time</th>
                </tr>
            </thead>
            <tbody id="temp_tbody">
            `

    for (const stop of data) {
        for (const arrival of stop.data) {
            ms = Date.parse(arrival.arrivalTime) - Date.now()
            table += `
            <tr>
                <td>${stop.name}</td>
                <td>${arrival.formattedTime} (${Math.max(0, Math.floor(ms / 1000 / 60))} minutes)</td>
            </tr>
            `
        }
    }

    table += `
            </tbody>
        </table>
    `

    panelContainer = document.getElementById("panelContainer")
    panelContainer.innerHTML = table
}


async function pullData() {
    await buses();
    await arrivals();
}

async function setRoutes() {
    const response = await fetch("/move/data/routes", {
        method: "POST",
    });
    const data = await response.json();
    
    setBusRoutes(data)
}

setRoutes()
pullData()
setInterval(() => {
    arrivals();
}, 60*1000)

setInterval(() => {
    buses();
}, 3*1000)
