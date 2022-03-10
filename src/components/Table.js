import React, { Component } from 'react';
import Row from './Row.js';

export default class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // let entries = this.props.entries;
    // For now, use dummy data for entries.
    const entries = [{
      name: 'eggs', servingSize: '1', servingUnit: 'item(s)', calories: '70', totalFat: 'g', satFat: '0',
      transFat: '0', polyFat: '0', monoFat: '0', chol: '185', sodium: '70', totalCarbs: '0', totalFiber: '0',
      solFiber: '0', insolFiber: '0', totalSugars: '0', addedSugars: '0', protein: '6'
    }]
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
        <thead>{header}</thead>
      )
    }
    
    entries.forEach(function (entry) {
      entryRows.push(
        <Row
          key={entry.name}
          entry={entry} />
      )
    })

    console.log(entryRows)

    return (
      <table className="table">
        <thead>
          {headers}
        </thead>
        <tbody>
          {entryRows}
        </tbody>
      </table>
    );
  }
}