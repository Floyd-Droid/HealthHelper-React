export default function TableButtons(props) {

	const status = props.status;
	const data = props.data
	const disableButton = (data.length === 1 && data[0].isPlaceholder) || props.isTableLoading;

	const handleAddNewRow = () => {
		props.onAddNewRow();
	}

	const handleDeleteEntries = () => {
    props.onDeleteRows();
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
						<a href='/log/create' className='btn bg-btn mx-3'>Create Entries</a>
					}
					{status==='createLog' &&
						<a href='/log' className='btn bg-btn mx-3'>Back to log</a>
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
