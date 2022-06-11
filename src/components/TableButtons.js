const TableButtons = (props) => {

	const status = props.status;
	const data = props.data
	const disableButton = data.length === 1 && data[0].isPlaceholder;

	const handleDeleteEntries = () => {
    props.onDeleteRows();
	}

	const handleNav = (e) => {
    props.onNavSubmit(e.target.value);
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
					{status!=='index' &&
						<button type='button' className='btn bg-btn mr-3' onClick={handleNav} value='index'>Go to index</button>
					}
					{status==='logs' &&
						<button type='button' className='btn bg-btn mx-3' onClick={handleNav} value='createLog'>Create entries</button>
					}
					{status!=='logs' &&
						<button type='button' className='btn bg-btn mx-3' onClick={handleNav} value='logs'>Go to logs</button>
					}
          
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleDeleteEntries}>Delete selected entries</button>
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleResetData}>Undo changes</button>
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={handleSubmit}>Submit changes</button>
        </div>
      </form>
	)
}

export default TableButtons;