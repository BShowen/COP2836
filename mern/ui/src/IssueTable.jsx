import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Glyphicon, OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

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
    <Table bordered striped hover condensed responsive>
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
    </Table>
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
  const editTooltip = (
    // <Tooltip id='close-tooltip'>
    <Tooltip id='edit-tooltip'>
      Edit issue
    </Tooltip>
  );
  function onDelete(e){
    e.preventDefault();
    deleteIssue(index);
  }
  function onClose(e){
    e.preventDefault();
    closeIssue(index);
  }

  const tableRow = (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ''}</td>
      <td>{issue.title}</td>
      <td>
        <LinkContainer to={`/edit/${issue.id}`}>
          <OverlayTrigger placement='top' delayShow={250} overlay={editTooltip}>
            <Button bsSize='xsmall'>
              <Glyphicon glyph="edit"/>
            </Button>
          </OverlayTrigger>
        </LinkContainer>
        &nbsp;
        <OverlayTrigger placement='top' delayShow={250} overlay={closeTooltip}>
          <Button bsSize='xsmall' type="button" onClick={onClose}>
            <Glyphicon glyph='remove'/>
          </Button>
        </OverlayTrigger>
        &nbsp;
        <OverlayTrigger placement='top' delayShow={250} overlay={deleteTooltip}>
          <Button bsSize='xsmall' type="button" onClick={onDelete}>
            <Glyphicon glyph='trash' />
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
  );

  return(
    <LinkContainer to={selectLocation}>
      {tableRow}
    </LinkContainer>
  );
});
