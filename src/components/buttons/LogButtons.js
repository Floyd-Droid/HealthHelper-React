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
    this.props.onSubmit();
  }

  render() {
    return (
      <form>
        <div className='d-flex justify-content-start'>
          {/*margin-right not taking for first button */}
          <button type='button' className='btn bg-btn mr-3' onClick={this.handleNav} value='index'>Go to index</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleNav} value='addLog'>Add entries</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleDeleteEntries}>Delete selected entries</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleResetData}>Undo changes</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleSubmit}>Submit changes</button>
        </div>
      </form>
    );
  }
}