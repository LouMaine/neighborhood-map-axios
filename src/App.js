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
      zoom: 9

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
          animation: window.google.maps.Animation.DROP,
          title: locVenue.venue.name,
          id: locVenue.venue.id
        });

        // click on marker to display infowindow
        marker.addListener('click', function(event) {
          console.log('click event?', event);
          // change the content
          infowindow.setContent(venueName);
          // open info window
          infowindow.open(map, marker);
        });
        // Extend boundry on map for each marker
        bounds.extend(marker.position);
        gblMarkers.push(marker);
      })
      // makes map fit to boundry
      map.fitBounds(bounds);
      this.setState({ gblMarkers });
  }

  // Api call foursquare  and axios data credit to Elharony videos on Maps
  getVenues(query = '') {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const params = {
      client_id: '0XBIXCHNQCEQD21UPJ5DKCPFB1W34S4XEQ1HGYWLBBNHDMCS',
      client_secret: 'C0QAOQSWA4WTDNO1ZZ3MS4KQXFTBXSTYLNJR3JIB1DMRNVJR',
      query: query,
      near: 'Castine',
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
        <li
            key={id}
            onClick={() => this.handleVenueClick(index)}

            aria-labelledby="venue_list"
            tabIndex="0"
            >            

            <img className="view-list-Marker" src={Marker} alt="google-marker"/>
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
window.googlemaps_authFailure = function() {
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
