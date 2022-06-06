import React from 'react';

export default class LogButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteEntries = this.handleDeleteEntries.bind(this);
    this.handleNav = this.handleNav.bind(this);
    this.handleResetData = this.handleResetData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDeleteEntries(e) {
    e.preventDefault();
    this.props.onDeleteRows();
  }

  handleNav(e) {
    e.preventDefault();
    this.props.onNavSubmit(e.target.value);
  }

  handleResetData(e) {
    e.preventDefault();
    this.props.onResetData();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
		const data = this.props.data
		const disableButton = data.length === 1 && data[0].isPlaceholder;

    return (
      <form>
        <div className='d-flex justify-content-start'>
          <button type='button' className='btn bg-btn mr-3' onClick={this.handleNav} value='index'>Go to index</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleNav} value='createLog'>Create entries</button>
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={this.handleDeleteEntries}>Delete selected entries</button>
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={this.handleResetData}>Undo changes</button>
          <button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={this.handleSubmit}>Submit changes</button>
        </div>
      </form>
    );
  }
}