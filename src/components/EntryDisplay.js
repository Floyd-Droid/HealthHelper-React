import React, { Component } from 'react';
import SearchBar from './SearchBar.js';
import Table from './Table.js';


export default class FilterableFoodTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      searchText: ''
    };
  }

  handleSearchTextChange(searchText) {
    this.setState({
      searchText: searchText
    })
  }

  render() {
    return (
      <div className="entryDisplay">
        <div className="searchBar">
          <SearchBar
            searchText={this.state.searchText}
            onSearchTextChange={this.handleSearchTextChange} />
        </div>
        <div className="table">
          <Table
            status={this.props.status}
            entries={this.state.entries}
            date={this.props.date} />
        </div>
      </div>
    );
  }
}
