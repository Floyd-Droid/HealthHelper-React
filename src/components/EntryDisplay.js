import React, { Component } from 'react';
import SearchBar from './SearchBar.js';
import LogTable from './LogTable.js';


export default class EntryDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      searchText: ''
    };
  }

  componentDidMount() {
    this.updateEntries();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status !== this.props.status || prevProps.date !== this.props.date) {
      this.updateEntries();
    }
  }

  getFormattedDate(date, context) {
    // date is a Date() obj to be converted to a formatted string depending on context
    // context is a string that determines if the date will be formatted for url or human readability
    if (context === 'table') {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } else if (context === 'url') {
      let slash_date = date.toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });
      return slash_date.replace(/\//g, '-');
    } else {
      console.log("see getFormattedDate")
    }
  }

  handleSearchTextChange(searchText) {
    this.setState({
      searchText: searchText
    })
  }

  updateEntries() {
    let status = this.props.status;
    let date = this.props.date;
    let url = '';
    let userId = this.props.userId;

    // Fetch index or log entries
    if (status === 'logs') {
      let formattedDate = this.getFormattedDate(date, 'url');
      url = `/api/${userId}/logs?date=${formattedDate}`;
    } else if (status === 'index') {
      url = `/api/${userId}/index`;
    } else {
      console.log("see updateEntries")
    }

    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          entries: data
        });
      })
      .catch(error => {
        console.log(error)
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
          <LogTable
            status={this.props.status}
            entries={this.state.entries}
            date={this.props.date} />
        </div>
      </div>
    );
  }
}
