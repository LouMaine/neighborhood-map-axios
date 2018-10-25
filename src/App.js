import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import SearchedNav from './SearchedNav'
import Marker from './images/marker.png'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      venues: [],
      gblMarkers: [],
    }

    this.initMap = this.initMap.bind(this);
    this.getVenues = this.getVenues.bind(this);
  }

  componentDidMount() {
    document.title = 'Map App'
    this.getVenues();
  }


  // load map script attribute to Elharony videos on Maps
  loadMap() {
    this.loadScript = false
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBsBLzRJXJvP71hA4Mw3HqILtRQmX_1zBs&callback=initMap")
    window.initMap = this.initMap;
    window.google = {}
  }

  //  google map is called
  initMap() {
    // creates InfoWindow to open
    let infowindow = new window.google.maps.InfoWindow();
    let bounds = new window.google.maps.LatLngBounds();

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 44.388861, lng: -68.798958},
      zoom: 15

    });
    const gblMarkers = [];

    // display venues  
      this.state.venues.forEach(locVenue => {
        // display venue name in window
        let venueName = `${locVenue.venue.name}`;
        
        // displays markers with Animation
        let marker = new window.google.maps.Marker({
          position: {lat: locVenue.venue.location.lat, lng: locVenue.venue.location.lng},
          map: map,

          animation: window.google.maps.Animation.BOUNCE,
          animation: window.google.maps.Animation.DROP,
          title: locVenue.venue.name,
          address: locVenue.venue.location.address,
          id: locVenue.venue.id,

          });

        // click on marker to display infowindow
        //old-marker.addListener('click', function(event) {
        //old-console.log('click event?', event);
          // change the content
         //0ld-infowindow.setContent(venueName);
         let info_Window = '<div class="info_window">' +
         '<h6>' + locVenue.venue.name + '</h6>' +
         //infowindow.setContent(venueName);
         '<p>' + locVenue.venue.location.formattedAddress[0] + '</p>' +
         '<p>' + locVenue.venue.location.formattedAddress[1] + '</p>' +
         '</div>'
          marker.addListener('click', function(event) {
          console.log('click event?', event);
            if (marker.getAnimation() !== null) { marker.setAnimation(null); }
           else { marker.setAnimation(window.google.maps.Animation.BOUNCE); }
          setTimeout(() => { marker.setAnimation(null) }, 1000);
        });
           window.google.maps.event.addListener(marker, 'click', () => {
           infowindow.setContent(info_Window);
           map.setZoom(16);
           map.setCenter(marker.position);
           infowindow.open(this.map, marker);
           //map.panBy(0, -125);
        });
        
        gblMarkers.push(marker);
       // info_windows.push({ id: venue.id, name: venue.name, contents: infowindow});
         
        //old-infowindow.open(map, marker);
        });
        // Extend boundry on map for each marker
        //bounds.extend(marker.position);
       //old-gblMarkers.push(marker);
      //old-})
      // makes map fit to boundry
      //map.fitBounds(bounds);
      this.setState({ gblMarkers });
  }

  // Api call foursquare  and axios data credit to Elharony videos on Maps
  getVenues(query = '') {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const params = {
      client_id: '0XBIXCHNQCEQD21UPJ5DKCPFB1W34S4XEQ1HGYWLBBNHDMCS',
      client_secret: 'C0QAOQSWA4WTDNO1ZZ3MS4KQXFTBXSTYLNJR3JIB1DMRNVJR',
      query: query,
      limit: 5,
      near: 'castine',
      v: '20181016'
    };

    axios.get(endPoint + new URLSearchParams(params))
      .then(response => {
        const { groups } = response.data.response;
        this.setState({ venues: groups[0].items}, this.loadMap(false));
      })
      .catch(error => {
        console.log(error);
        alert('Error..Error Foursqaure API failed to load')
      })
  }

  // finds index of gblMarkers then adds click to them
  handleVenueClick(index) {
    const { gblMarkers } = this.state;
    window.google.maps.event.trigger(gblMarkers[index], 'click');
    /* 
        if maker index does not !== equal null, set to null 
        else sets marker to ` BOUNCE `
    */
      if (gblMarkers[index].getAnimation() !== null) {
        gblMarkers[index].setAnimation(null, );
      } else {
        gblMarkers[index].setAnimation(window.google.maps.Animation.BOUNCE);
        gblMarkers[index].setAnimation(6);
      } 
  }

  render() {

    const ListViewData = this.state.venues.map((item, index) => {
      const { id, name } = item.venue;
      return (
        <li role = "link"
            key={id}
            onClick={() => this.handleVenueClick(index)}

            tabIndex="0"
            >            

            <img className="view-list-Marker" src={Marker} alt="venue-menu-marker"/>
            {name}
          </li>
      );
    });

    return (
      <main className="app-container" role="main">
        <div className="map-wrapper">
          <div id="map" role="application"/>
       </div>
       <div className="ListViewSetup">
         <SearchedNav getVenues={this.getVenues}/>
          <div className="listMenu-Box">
          <h4 className="menu-title">Markers View List</h4>
          <ul className="list-view-menu" id="venue_list">
          {ListViewData}
           </ul>
           </div>
        </div>
      </main>
    );
  }
}

// Google authentication API error alert
window.gm_authFailure = function() {
  alert('Google map key failure error');
}


function loadScript(source) {
  let index = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = source;
  script.async = true;
  script.defer = true;
  script.onerror = function() {
    alert("Google Maps failed to load please check connection");
};
  
  index.parentNode.insertBefore(script, index);
}
