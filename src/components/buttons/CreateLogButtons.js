import React from 'react';

export default class CreateLogButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleNav = this.handleNav.bind(this);
    this.handleResetData = this.handleResetData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
		const data = this.props.data;
		const disableButton = data.length === 1 && typeof data[0].isPlaceholder;

    return (
      <form>
        <div className='d-flex justify-content-start'>
          <button type='button' className='btn bg-btn mx-3' onClick={this.handleNav} value='logs'>Back to logs</button>
					<button type='button' className='btn bg-btn mx-3' onClick={this.handleNav} value='index'>Go to index</button>
					<button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={this.handleResetData}>Reset</button>
					<button type='button' className='btn bg-btn mx-3' disabled={disableButton} onClick={this.handleSubmit}>Submit entries</button>
        </div>
      </form>
    );
  }
}