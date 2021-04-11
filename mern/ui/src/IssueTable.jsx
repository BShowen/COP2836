import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function IssueTable({ issues, closeIssue, deleteIssue }){
  const issueRows = issues.map((issue, index) => (
    <IssueRow 
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));

  return(
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody> 
        {issueRows}
      </tbody>
    </table>
  );
}


const IssueRow = withRouter(({ 
  issue, 
  location: { search }, 
  closeIssue, 
  deleteIssue, 
  index,
}) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  const deleteTooltip = (
    <Tooltip id='delete-tooltip'>
      Delete Issue
    </Tooltip>
  );
  const closeTooltip = (
    <Tooltip id='close-tooltip'>
      Close Issue
    </Tooltip>
  );
  return(
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ''}</td>
      <td>{issue.title}</td>
      <td>
        <Link to={`/edit/${issue.id}`}>Edit</Link>
        {' | '}
        <NavLink to={selectLocation}>Select</NavLink>
        {' | '}
        <OverlayTrigger placement='top' delayShow={250} overlay={closeTooltip}>
          <Button bsSize='xsmall' type="button" onClick={()=>{ closeIssue(index); }}>
            <Glyphicon glyph='remove'/>
          </Button>
        </OverlayTrigger>
        {/* Here, I use &nbsp; instead of {' '} */}
        {/* {' '} */}
        &nbsp;
        <OverlayTrigger placement='top' delayShow={250} overlay={deleteTooltip}>
          <Button bsSize='xsmall' type="button" onClick={()=>{ deleteIssue(index); }}>
            <Glyphicon glyph='trash' />
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
  );
});
