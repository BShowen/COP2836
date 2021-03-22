import React from 'react';
import PropTypes from 'prop-types';

export default class IssueAdd extends React.Component{
  constructor(){
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e){
      e.preventDefault();
      const form = document.forms.issueAdd;
      const issue = {
          owner: form.owner.value, 
          title: form.title.value, 
          due: new Date(new Date().getTime() + 1000*60*60*24*10), 
          effort: form.effort.value
      }
      const { createIssue } = this.props;
      createIssue(issue);
      form.owner.value = ''; 
      form.effort.value = '';
      form.title.value = '';
      form.owner.focus();
  }

  render(){
      return(
          <form name="issueAdd" onSubmit={this.handleSubmit}>
              <input type="text" name="owner" placeholder="Owner"/>
              <input type="text" name="effort" placeholder="Effort"/>
              <input type="text" name="title" placeholder="Title"/>
              <button type="submit">Add</button>
          </form>

      );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};