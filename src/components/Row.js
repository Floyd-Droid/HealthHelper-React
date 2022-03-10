import React, { Component } from 'react';

export default class Row extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let entry = this.props.entry;
    const foodInfo = [];

    for (let key of Object.keys(entry)) {
      foodInfo.push(
        <td>{entry[key]}</td>
      )
    }

    return (
      <tr>
        {foodInfo}
      </tr>
    );
  }
}