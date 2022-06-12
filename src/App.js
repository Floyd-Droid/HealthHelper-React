import React from 'react';
import './index.css'

import DateForm from './components/DateForm';
import IndexTable from './components/IndexTable';
import LogTable from './components/LogTable';

const App = () => {
	const [status, setStatus] = React.useState('logs');
	const [userId, setUserId] = React.useState(1);
	const [date, setDate] = React.useState(new Date());

	const updateDate = (newDate) => {
		setDate(newDate);
	}

	const updateStatus = (newStatus) => {
		setStatus(newStatus);
	}

	return (
		<div className='app-container vw-100 vh-100 p-3' >

      {status !== 'index' &&
        <>
          <DateForm 
          date={date}
          onDateFormSubmit={updateDate}
          />
          <LogTable
            status={status}
            userId={userId}
            date={date} 
            onNavSubmit={updateStatus}
          />
        </>
      }
      {status === 'index' &&
				<IndexTable
					status={status}
					userId={userId}
					onNavSubmit={updateStatus}
				/>
      }
    </div>
	)
}

export default App;