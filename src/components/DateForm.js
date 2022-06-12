import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateForm(props) {

	const date = props.date;

  const incrementDate = (e) => {
    const value = e.target.value;
    const newDay = date.getDate() + Number(value);
    const newDate = new Date(date.setDate(newDay));

    props.onDateFormSubmit(newDate)
  }
  
	return (
		<div className='container d-flex justify-content-center'>
			<button className='btn date-btn p-0 mx-2' type='button' onClick={incrementDate} value='-1'>
				prev
			</button>
			<div>
			<DatePicker className='date-input' 
				selected={date} onChange={(date) => props.onDateFormSubmit(date)}/>
			</div>
			<button className='btn date-btn p-0 mx-2' type='button' onClick={incrementDate} value='1'>
				next
			</button>
		</div>
	);
}