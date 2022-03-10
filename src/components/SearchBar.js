import React, { Component } from 'react';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
  }

  handleSelectAll(e) {
    console.log("You click 'Select All'")
  }

  handleSearchTextChange(e) {
    this.props.onSearchTextChange(e.target.value);
  }

  render() {
    return (
      <div>
        <form>
          <button
            value
            onClick={this.handleSelectAllClick}>
            Select All
          </button>
          <input
            type="text"
            placeholder="Search"
            value={this.props.searchText}
            onChange={this.handleSearchTextChange} />
        </form>
      </div>
    );
  }
}