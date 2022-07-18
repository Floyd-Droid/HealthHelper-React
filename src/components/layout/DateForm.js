import React, { useContext } from 'react';
import DatePicker from 'react-datepicker';

import GlobalContext from '../../context/GlobalContext';
import Button from 'react-bootstrap/Button';
import 'react-datepicker/dist/react-datepicker.css';


export default function DateForm() {
	const { date, updateDate } = useContext(GlobalContext);

  const incrementDate = (num) => {
    const newDay = date.getDate() + num;
    const newDate = new Date(date.setDate(newDay));

    updateDate(newDate);
  }
  
	return (
		<div className='d-flex justify-content-center align-items-center'>
			<Button variant='outline-light' className='date-btn px-2 py-0 me-2' onClick={() => incrementDate(-1)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE4B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-left">
					<polyline points="11 17 6 12 11 7"></polyline>
					<polyline points="18 17 13 12 18 7"></polyline>
				</svg>
			</Button>
			<div>
			<DatePicker className='date-input text-black text-center'
				selected={date} onChange={(date) => updateDate(date)}/>
			</div>
			<Button variant='outline-light' className='date-btn px-2 py-0 ms-2' onClick={() => incrementDate(1)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EE4B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right">
					<polyline points="13 17 18 12 13 7"></polyline>
					<polyline points="6 17 11 12 6 7"></polyline>
				</svg>
			</Button>
		</div>
	);
}