import React from 'react';

export default class DateForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const month = event.target.elements[0].value
    const day = event.target.elements[1].value
    const year = event.target.elements[2].value

    const newDate = new Date(year, month, day)

    this.props.onDateFormSubmit(newDate);
  }
  
  render() {

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 
      'September', 'October', 'November', 'December']

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="month">Date</label>
          <select defaultValue={this.props.date.getMonth()}>
            {months.map((month, index) => {
              return <option key={index} value={index.toString()}>{month}</option>;
            })}
          </select>
          <input
            type="text"
            defaultValue={this.props.date.getDate()} />
          <input
            type="text"
            defaultValue={this.props.date.getFullYear()} />
          <input
            type="submit"
            value="Submit" />
        </form>
      </div>
    );
  }
}