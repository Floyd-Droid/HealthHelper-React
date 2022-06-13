export default function TableButtons(props) {

	const status = props.status;
	const data = props.data
	const disableButton = data.length === 1 && data[0].isPlaceholder;

	const handleAddNewRow = () => {
		props.onAddNewRow();
	}

	const handleDeleteEntries = () => {
    props.onDeleteRows();
	}

	const handleNavigate = (e) => {
    props.onNavigate(e.target.value);
  }

	const handleResetData = () => {
    props.onResetData();
  }

  const handleSubmit = () => {
    props.onSubmit();
  }

	return (
		<form>
        <div className='d-flex justify-content-start'>
					{status==='log' &&
						<button type='button' className='btn bg-btn mx-3' onClick={handleNavigate} value='createLog'>Create entries</button>
					}
					{status==='createLog' &&
						<button type='button' className='btn bg-btn mx-3' onClick={handleNavigate} value='log'>Back to log</button>
					}
          {status!=='createLog' &&
						<button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleDeleteEntries}>Delete selected entries</button>
					}
          {status==='index' &&
						<button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleAddNewRow}>Add new row</button>
					}
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleResetData}>Reset</button>
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleSubmit}>Submit</button>
        </div>
      </form>
	)
}
