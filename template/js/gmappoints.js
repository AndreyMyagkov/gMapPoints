/* TOUR MAP*/


// 1. Инициация карты
if (typeof (google) != 'undefined' && google.maps) {
    google.maps.event.addDomListener(window, "load", initmap);
}

function initmap() {
    //if (!window.google || !window.google.maps)        return;
    var opts = {
        zoom: 6,
        center: { lat: 53.405295, lng: 107.673184 },
        scrollwheel: true,
        disableDoubleClickZoom: false,
        draggable: true,
        keyboardShortcuts: true,
        mapTypeControl: true,
        zoomControl: true,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    window.GLOBAL_arMapObjects['MAP_PxWcPa'] = new google.maps.Map(document.getElementById('gmap'), opts);


    if (typeof window["BXShowMap_MAP_PxWcPa"] == 'function') {
        BXShowMap_MAP_PxWcPa();
    }
}

function BX_SetPlacemarks_MAP_PxWcPa() {

    exPoints.forEach(item => {
        let coord = item.tv_coord.split(/, +/);

        let img = '';
        if (item['foto']) {
            img = `<img src="/${item['foto']}">`;
        }
        BX_GMapAddPlacemark({
            "LON": coord[1],
            "LAT": coord[0],
            "ID": 'tour' + item['id'],
            "TITLE": item['title'],
            "TEXT": `<div class="map-object"><div>${img}</div><a class="btn btn--rounded-teal btn-formap" href="${item['url']}" target="_blank">Подробнее</a></div>`
        }, "MAP_PxWcPa");
    })


}


window.BX = {}
if (!window.GLOBAL_arMapObjects) window.GLOBAL_arMapObjects = {};


function BXMapGoogleAfterShow(mapId) {
    if (google.maps !== undefined && window.GLOBAL_arMapObjects[mapId] !== undefined)
        google.maps.event.trigger(window.GLOBAL_arMapObjects[mapId], 'resize');
}


function BXShowMap_MAP_PxWcPa() {
    window.directionsService = new google.maps.DirectionsService();
    window.directionsDisplay = new google.maps.DirectionsRenderer();
    window.directionsDisplay.setMap(window.GLOBAL_arMapObjects['MAP_PxWcPa']);

    if (typeof window["BXWaitForMap_view"] == 'function') {
        BXWaitForMap_view('MAP_PxWcPa');
    }
    else {

    }
}


// routemap.js
if (!window.BX_GMapAddPlacemark) {
    window.waypoints = {}
    window.startPosition = {}
    window.google_polylines_on_map = [];

    function setRoute(start, end, waypts, map_id) {
        start = start.split(',');
        end = end.split(',');
        var flightPlanCoordinates = [{
            lat: parseFloat(start[0]),
            lng: parseFloat(start[1])
        }];
        for (var i in waypts) {
            if (waypts[i]) {
                var point = waypts[i].location.split(',')
                flightPlanCoordinates.push({
                    lat: parseFloat(point[0]),
                    lng: parseFloat(point[1])
                })
            }
        }

        flightPlanCoordinates.push({
            lat: parseFloat(end[0]),
            lng: parseFloat(end[1])
        })

        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#12c5cd',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        window.google_polylines_on_map.push(flightPath);
        flightPath.setMap(window.GLOBAL_arMapObjects[map_id]);
    }

    function addToRoute(coord, index, map_id, id) {
        if (!coord) return;
        if (window.startPosition[id]) {
            if (!index) index = window.waypoints[id].length;
            setRoute(window.startPosition[id], coord, window.waypoints[id], map_id);
            window.waypoints[id][index] = {
                location: coord,
                stopover: true
            };
        } else {
            window.waypoints[id] = [];
            window.startPosition[id] = coord;
        }
    }
    window.google_placemarks_on_map = [];
    window.BX_GMapAddPlacemark = function (arPlacemark, map_id) {

        var map = GLOBAL_arMapObjects[map_id];


        if (null == map) {
            return false;
        }


        if (!arPlacemark.LAT || !arPlacemark.LON) {
            return false;
        }



        var markerImage = new google.maps.MarkerImage('/template/i/icon.png', new google.maps.Size(27, 27), new google.maps.Point(0, 0), new google.maps.Point(13, 13));

        var obPlacemark = new google.maps.Marker({
            'position': new google.maps.LatLng(arPlacemark.LAT, arPlacemark.LON),

            'map': map,
            'title': arPlacemark.TITLE,
            'icon': markerImage
        });

        window.google_placemarks_on_map.push(obPlacemark);
        addToRoute(arPlacemark.LAT + ", " + arPlacemark.LON, false, map_id, arPlacemark.ID); {
            obPlacemark.infowin = new google.maps.InfoWindow({
                content: '<b class="map-title">' + arPlacemark.TITLE + '</b>' + (arPlacemark.TEXT ? arPlacemark.TEXT.replace(/\n/g, '<br />') : '')
            });
            google.maps.event.addListener(obPlacemark, 'click', function () {
                if (null != window['__bx_google_infowin_opened_' + map_id])
                    window['__bx_google_infowin_opened_' + map_id].close();
                this.infowin.open(this.map, this);
                window['__bx_google_infowin_opened_' + map_id] = this.infowin;
            });
        }
        var id = (arPlacemark.LAT + arPlacemark.LON);
        if (!window.google_placemarks) window.google_placemarks = {};
        if (!window.google_placemarks[arPlacemark['ID']]) window.google_placemarks[arPlacemark['ID']] = {};
        if (!window.google_placemarks[arPlacemark['ID']][id]) {
            window.google_placemarks[arPlacemark['ID']][id] = arPlacemark;
        }
        return obPlacemark;
    }
}


if (null == window.BXWaitForMap_view) {
    function BXWaitForMap_view(map_id) {
        if (null == window.GLOBAL_arMapObjects)
            return;
        if (window.GLOBAL_arMapObjects[map_id])
            window['BX_SetPlacemarks_' + map_id]();
        else
            setTimeout('BXWaitForMap_view(\'' + map_id + '\')', 300);
    }
}


$('.infrastructure-map-select').on('change', function () {
    var tourID = $(this).val(),
        link = $('.infrastructure-map-select').children('[value="' + tourID + '"]').attr('data-url'),
        placemarks = window.google_placemarks[tourID],
        $map = $('#gmap'),
        mapID = 'MAP_PxWcPa',
        map = GLOBAL_arMapObjects['MAP_PxWcPa'];
    if (!tourID) {
        BX_SetPlacemarks_MAP_PxWcPa();
        var bounds = new google.maps.LatLngBounds();
        for (var index = 0; index < google_placemarks_on_map.length; index++) {
            bounds.extend(google_placemarks_on_map[index].getPosition());
        }
        map.fitBounds(bounds);
        if (map.zoom > 6) {
            map.setZoom(6);
        }
        return;
    }
    for (var i = 0; i < google_placemarks_on_map.length; i++) {
        google_placemarks_on_map[i].setMap(null);
    }
    google_placemarks_on_map = [];
    for (var i = 0; i < google_polylines_on_map.length; i++) {
        google_polylines_on_map[i].setMap(null);
    }
    google_polylines_on_map = [];
    for (var index in placemarks) {
        window.BX_GMapAddPlacemark(placemarks[index], mapID);
    };
    var bounds = new google.maps.LatLngBounds();
    for (var index = 0; index < google_placemarks_on_map.length; index++) {
        bounds.extend(google_placemarks_on_map[index].getPosition());
    }
    map.fitBounds(bounds);
    if (map.zoom > 8) {
        map.setZoom(8);
    }
});

/* /TOUR MAP*/