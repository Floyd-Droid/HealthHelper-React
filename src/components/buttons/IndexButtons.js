import React from 'react';

export default class IndexButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteEntries = this.handleDeleteEntries.bind(this);
    this.handleNav = this.handleNav.bind(this);
    this.handleResetData = this.handleResetData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDeleteEntries(e) {
    e.preventDefault();
    console.log('this will delete the selected entries');
  }

  handleNav(e) {
    // Navigate to selected page by updating the App's status
    e.preventDefault();
    this.props.onNavSubmit(document.activeElement.value);
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
      <div className="index-buttons">
        <form onSubmit={this.handleNav}>
          <button type="submit" name="sub" value="logs">Go to logs</button>
          <button type="submit" name="sub" value="addIndex">Add an entry</button>
          <button onClick={this.handleDeleteEntries}>Delete selected entries</button>
          <button onClick={this.handleResetData}>Undo changes</button>
          <button onClick={this.handleSubmit}>Submit changes</button>
        </form>
      </div>
    );
  }
}