import React, { Component } from 'react';

const INDEX_HEADERS = [
  'Name', 'Serving Size', 'Calories', 'Total Fat',
  'Sat. fat', 'Trans Fat', 'Poly. Fat', 'Mono. Fat', 'Cholesterol', 'Sodium', 'Total Carbs',
  'Total Fiber', 'Soluble Fiber', 'Insoluble Fiber', 'Total Sugars', 'Added Sugars',
  'Protein', 'Cost'
]

const LOG_HEADERS = [
  'Name', 'Amount', 'Calories', 'Total Fat', 'Sat. fat', 'Trans Fat', 'Poly. Fat', 'Mono. Fat',
  'Cholesterol', 'Sodium', 'Total Carbs', 'Total Fiber', 'Soluble Fiber', 'Insoluble Fiber',
  'Total Sugars', 'Added Sugars', 'Protein', 'Cost'
]


export default class HeaderRow extends Component {
  constructor(props) {
    super(props);
  }

  getHeaders() {
    let status = this.props.status;
    let headers;

    if (status === 'logs' || status === 'initial') {
      headers = LOG_HEADERS;
    } else if (status === 'index') {
      headers = INDEX_HEADERS;
    } else {
      // what do?
      headers = ['in the else of HeaderRow render'];
    }

    const header_row = [];

    headers.forEach(function (header) {
      header_row.push(
        <th key={header}>{header}</th>
      );
    })

    return header_row;
  }


  render() {

    let header_row = this.getHeaders();

    return (
      <tr>
        {header_row}
      </tr>
    )
  }

}