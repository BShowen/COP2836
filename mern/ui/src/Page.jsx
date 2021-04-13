import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown, 
  MenuItem, Glyphicon, Tooltip, OverlayTrigger, Grid,
} from 'react-bootstrap';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import { LinkContainer } from 'react-router-bootstrap';


import Contents from './Contents.jsx';

function NavBar(){
  return (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>Issue Tracker</Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer exact to="/">
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer to="/issues">
          <NavItem>Issue List</NavItem>
        </LinkContainer>
        <LinkContainer to="/report">
          <NavItem>Report</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        <IssueAddNavItem/>
        <NavDropdown
          id="user-dropdown"
          title={<Glyphicon glyph="option-vertical" />}
          noCaret
        >
        <MenuItem>About</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}

function Footer(){
  return(
    <small>
      <hr/>
      <p className="text-center">
        Full source code available as this
        {' '}
        <a href="https://github.com/vasansr/pro-mern-stack-2/" target="_blank">
          Github repository
        </a>
      </p>
    </small>
  );
}

export default function Page(){
  return (
    <div>
      <NavBar />
      <Grid fluid>
        <Contents />
      </Grid>
      <Footer />
    </div>
  );
}