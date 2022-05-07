import React from 'react';

export default class IndexButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddNewRow = this.handleAddNewRow.bind(this);
    this.handleDeleteEntries = this.handleDeleteEntries.bind(this);
    this.handleNav = this.handleNav.bind(this);
    this.handleResetData = this.handleResetData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAddNewRow(e) {
    e.preventDefault();
    this.props.onAddNewRow();
  }

  handleDeleteEntries(e) {
    e.preventDefault();
    this.props.onDeleteRows();
  }

  handleNav(e) {
    // Navigate to selected page by updating the App's status
    e.preventDefault();
    this.props.onNavSubmit('logs');
  }

  handleResetData(e) {
    e.preventDefault();
    this.props.onResetData();
  }

  handleSubmit(e) {
    // Update the DB
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    return (
      <form>
        <div className='d-flex justify-content-start'>
          <button type='button' className='btn bg-btn mr-3' onClick={this.handleNav}>Go to logs</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleAddNewRow}>+</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleDeleteEntries}>Delete selected entries</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleResetData}>Undo changes</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleSubmit}>Submit changes</button>
        </div>
      </form>
    );
  }
}