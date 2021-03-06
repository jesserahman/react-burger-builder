import React from 'react';
import './BuildControl.css'

const buildControl = (props) => {
  return (
    <div className="BuildControl">
      <div className="Label"> {props.ingredient_label} </div>
      <button 
        onClick={props.addIngredient} 
        className="More"> 
        Add 
      </button>
      <button 
        disabled={props.isButtonDisabled}
        className="Less"
        onClick={props.removeIngredient}> 
        Remove 
      </button>
    </div>
  )
}

export default buildControl;