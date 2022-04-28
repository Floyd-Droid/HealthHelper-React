import React from 'react';
import $ from 'jquery';

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
    console.log('this will delete the selected entries');
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
        <button className='bg-index-btn' onClick={this.handleNav}>Go to logs</button>
        <button className='bg-index-btn' onClick={this.handleAddNewRow}>+</button>
        <button className='bg-index-btn' onClick={this.handleDeleteEntries}>Delete selected entries</button>
        <button className='bg-index-btn' onClick={this.handleResetData}>Undo changes</button>
        <button className='bg-index-btn' onClick={this.handleSubmit}>Submit changes</button>
      </form>
    );
  }
}