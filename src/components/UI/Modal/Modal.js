import React, {Component} from 'react';
import './Modal.css'
import Aux from '../../../hoc/Aux'
import Backdrop from '../Backdrop/Backdrop'

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState){
    // returns true or false
    return nextProps.show !== this.props.show || nextProps.children !== this.props
  }

  componentWillUpdate(){
    console.log("modal will update")
  }

  render(){
    return (
      <Aux>
        <Backdrop shouldShow={this.props.show} close={this.props.backdropClickProp} />
        <div
          className="Modal"
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(100vh)',
            opacity: this.props.show ? '1' : '0'
          }} >
          {this.props.children}
        </div >
      </Aux>

    )
  }
  
}

export default Modal;