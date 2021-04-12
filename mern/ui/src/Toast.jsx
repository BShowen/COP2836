import React from 'react';
import { Alert, Collapse } from 'react-bootstrap'

export default class Toast extends React.Component {
  componentDidUpdate(){
    console.log("Toast: componentDidUpdate()");
    const { showing, onDismiss } = this.props;
    if(showing){
      clearTimeout(this.dismissTimer);
      this.dismissTimer = setTimeout(onDismiss, 5000);
    }
  }

  componentWillUnmount(){
    console.log("Toast: componentWillUnmount()");
    clearTimeout(this.dismissTimer);
  }

  render(){
    console.log("Toast: render()");
    const { showing, bsStyle, onDismiss, children, } = this.props;
    return(
      <Collapse in={showing}>
        <div style={{ position: 'fixed', bottom: 20, left: 20 }}>
          <Alert bsStyle={bsStyle} onDismiss={onDismiss}>
            {children}
          </Alert>
        </div>
      </Collapse>
    );
  }
}