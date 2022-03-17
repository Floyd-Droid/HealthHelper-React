import React, { Component } from 'react';
import Row from './Row.js';

export default class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let entries = this.props.entries;
    const entryRows = [];

    // Set up headers. Eventually need a component to handle variable headers
    const headers = [];
    const LOG_HEADERS = [
      'Name', 'Amount', 'Calories', 'Total Fat', 'Sat. fat', 'Trans Fat', 'Poly. Fat', 'Mono. Fat',
      'Cholesterol', 'Sodium', 'Total Carbs', 'Total Fiber', 'Soluble Fiber', 'Insoluble Fiber',
      'Total Sugars', 'Added Sugars', 'Protein', 'Cost'
    ];
    for (let header of LOG_HEADERS) {
      headers.push(
        <th>{header}</th>
      )
    }
    
    entries.forEach(function (entry) {
      entryRows.push(
        <Row
          key={entry.name}
          entry={entry} />
      )
    })

    return (
      <table className="table">
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {entryRows}
        </tbody>
      </table>
    );
  }
}