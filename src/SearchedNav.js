import React, { Component } from 'react'
import './App.css';

export default class SearchedNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputline: ''
    };

    this.formHandler = this.formHandler.bind(this);
  }

  //formHandler functions to set typed query in input line
  formHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { searchInputLine } = this.state;
    return (
      <div className="searchNav">
       <h2>Castine Location Search</h2>
        <input
          placeholder="Location Search"
          className="search"
          onChange={this.formHandler}
          type="text-field"
              
             name="searchInputLine"
             value={searchInputLine}
             id="searchInputLine"
              
          aria-label="search-venue"
        />
      <button 
          id="search-venue"
          className="searchBttn"

              button aria-label="Search-button"
              onClick={() => this.props.getVenues(searchInputLine)}
              >
          Search
        </button>
      </div>
    )
  }
}
