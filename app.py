from flask import Flask, render_template, jsonify
import requests
import json

app = Flask(__name__)

GMT_VEHICLES_URL = "https://maps.trilliumtransit.com/gtfsmap-realtime/feed/ccta-vt-us/vehicles"
CAT_VEHICLES_URL = "https://feeds.transloc.com/3/vehicle_statuses?agencies=603&include_arrivals=true"
# Arrivals must be queried with individual stopcodes
GMT_ARRIVALS_URL = "https://maps.trilliumtransit.com/gtfsmap-realtime/feed/ccta-vt-us/arrivals?stopCode="
GMT_ROUTES_URL = "https://gtfs-api.trilliumtransit.com/gtfs-api/routes/by-feed/ccta-vt-us"
GMT_STOPS_URL = "https://gtfs-api.trilliumtransit.com/gtfs-api/stops/by-feed/ccta-vt-us/route-id/19137,19139,13496,13497,13498,3190,3191,7458,11182,7455,74419,74409,74410,74411,19141,74418,74413,3175,74412,3153,3176,3167,3177,3181,3168,3183,3197,3194,19140,3195,3196,3186,7335,74414,74415,3171,3172,3174,3188,74416,74417,3163,3164,3165,19138,32941,32942,11183,19143,19142,19144,19145,"
STOP_DATA = "static/routes.json"
CATS_URL_NEW = "https://api.peaktransit.com/v5/index.php?app_id=_RIDER&key=c620b8fe5fdbd6107da8c8381f4345b4&controller=vehicles2&action=list&agencyID=159&routeID=12361"

DAVIS_CENTER_GMT_STOPCODE = "805489"
UHEIGHT_STOPCODE = "805490"
MED_STOPCODE = "805757"


@app.route("/", methods=["GET"])
def home():
    return render_template("map.html")

@app.route("/data/vehicles", methods=["POST"])
def vehicleData():
    # TODO: handle failure to fetch data
    return jsonify(vehicles());

@app.route("/data/arrivals", methods=["POST"])
def arrivalsData():
    return jsonify([
        gmt_arrivals("Davis/main st", DAVIS_CENTER_GMT_STOPCODE),
        gmt_arrivals("U Heights", UHEIGHT_STOPCODE),
        gmt_arrivals("UVM Med Center", MED_STOPCODE),
    ]);

def gmt_buses():
    res = requests.get(GMT_VEHICLES_URL)
    data = res.json()

    if data['status'] != "success":
        print("ERROR fetching gmt buses")
        return None

    items = data['data']

    ROUTES = ["19137", "19139"]
    vehicles = [bus for bus in items if bus["route_id"] in ROUTES]
    return vehicles


def cat_buses():
    res = requests.get(CATS_URL_NEW)
    data = res.json()
    if data['success'] != True:
        print("ERROR fetching cat buses")
        return None

    return [{'id': bus['vehicleName'],
             'lat': bus['lat'],
             'lon': bus['lng']} for bus in data['vehicles']]

def vehicles():
    return {
        'gmt': gmt_buses(),
        'cat': cat_buses()
    }

def gmt_arrivals(name, stopcode):
    res = requests.get(GMT_ARRIVALS_URL + stopcode)
    data = res.json()
    if data['status'] != 'success':
        return None
    return {
        'name': name,
        'type': 'gmt',
        'data': data['data']
    }

@app.route("/data/routes", methods=["POST"])
def get_stops():
    with open(STOP_DATA) as file:
        data = json.load(file)
    if(data):
        return data


if __name__=="__main__":
    app.run(debug=True)
