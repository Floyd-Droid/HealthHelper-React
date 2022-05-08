import React from 'react';

export default class AddLogButtons extends React.Component {
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
    return (
      <form>
        <div className='d-flex justify-content-start'>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleNav} value='logs'>Back to logs</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleDeleteEntries}>Delete selected entries</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleResetData}>Reset</button>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleSubmit}>Submit changes</button>
        </div>
      </form>
    );
  }
}