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
    console.log('This will delete the selected entries')
  }

  handleNav(e) {
    // Navigate to selected page by updating the App's status
    e.preventDefault();
    this.props.onNavSubmit(e.target.value);
  }

  handleResetData(e) {
    e.preventDefault();
    this.props.onResetData();
  }

  handleSubmit(e) {
    // Update the DB
    e.preventDefault();
    console.log('this will update the database')
  }

  render() {
    return (
      <form>
        <button className='bg-log-btn' onClick={this.handleNav} value='index'>Go to index</button>
        <button className='bg-log-btn' onClick={this.handleNav} value='addLog'>Add entries</button>
        <button className='bg-log-btn' onClick={this.handleDeleteEntries}>Delete selected entries</button>
        <button className='bg-log-btn' onClick={this.handleResetData}>Undo changes</button>
        <button className='bg-log-btn' onClick={this.handleSubmit}>Submit changes</button>
      </form>
    );
  }
}