/* eslint "react/prefer-stateless-function": "off" */
import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';

class IssueFilter extends React.Component {
  constructor({ location: { search } }){
    super();
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '', 
      effortMax: params.get('effortMax') || '', 
      changed: false,
    }
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
  }

  applyFilter(){
    const { status, effortMin, effortMax } = this.state;
    const { history } = this.props;

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax);

    const search = params.toString() ? `?${params.toString()}` : '' ; 
    history.push({ pathname: '/issues', search });
  }

  componentDidUpdate(prevProps){
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search){
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e){
    this.setState({ 
      status: e.target.value, 
      changed: true 
    });
  }

  onChangeEffortMin(e){
    const effortString = e.target.value;
    //We cant test using this because if we do then it wont allow the user to completely delete the numbers
    // from the min ro max form. Try it out and see what happens. 
    // if( !Number.isNaN( parseInt(effortString) ) ){
    if(effortString.match(/^\d*$/)){
      this.setState({ effortMin: e.target.value, changed: true });
    }
  }

  onChangeEffortMax(e){
    const effortString = e.target.value;
    // if( !Number.isNaN( parseInt(effortString) ) ){
    if(effortString.match(/^\d*$/)){
      this.setState({ effortMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter(){
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '', 
      effortMax: params.get('effortMax') || '', 
      changed: false,
    });
  }

  render(){
    const { status, changed, effortMin, effortMax } = this.state;
    return (
      <div>
        Status: 
        {' '}
        <select value={ status } onChange={this.onChangeStatus}>
          <option value="">(All)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </select>
        {' '}
        <button type='button' onClick={this.applyFilter}>Apply</button>
        {' '}
        <button type='button' onClick={this.showOriginalFilter} disabled={!changed}>Reset</button>
        {' '}
        Effort between:
        {' '}
        <input 
          size={5}
          value={effortMin}
          // This method is called every single time that a user types something into the field. 
          onChange={this.onChangeEffortMin}
        />
        {' - '}
        <input 
          size={5}
          value={effortMax}
          // This method is called every single time that a user types something into the field. 
          onChange={this.onChangeEffortMax}
        />
        {' '}
      </div>
    );
  }
}

export default withRouter(IssueFilter);