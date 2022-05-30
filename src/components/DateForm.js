import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class DateForm extends React.Component {

  constructor(props) {
    super(props);

    this.incrementDate = this.incrementDate.bind(this)
  }

  incrementDate(e) {
    const value = e.target.value;
    const newDay = this.props.date.getDate() + Number(value);
    const newDate = new Date(this.props.date.setDate(newDay));

    this.props.onDateFormSubmit(newDate)
  }
  
  render() {
      return (
        <div className='container d-flex justify-content-center'>
          <button className='btn date-btn p-0 mx-2' type='button' onClick={this.incrementDate} value='-1'>
            prev
          </button>
          <div>
          <DatePicker className='date-input' 
            selected={this.props.date} onChange={(date) => this.props.onDateFormSubmit(date)}/>
          </div>
          <button className='btn date-btn p-0 mx-2' type='button' onClick={this.incrementDate} value='1'>
            next
          </button>
        </div>
      );
  }
}