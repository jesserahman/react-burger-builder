import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.75,
  meat: 1.75,
  turkey: 1.25
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    total_price: 4,
    purchaseable: false,
    orderButtonClicked: false,
    loading: false
  }
  
  componentDidMount (){
    axios.get('https://react-my-burger-b3992.firebaseio.com//ingredients.json')
      .then(response => {
        console.log("Response.ingredients: ", response.data)
        console.log("Response", response)
        this.setState({ ingredients: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  orderButtonClick = () => {
    this.setState({
      orderButtonClicked: !this.state.orderButtonClicked
    });
  }

  purchaseContinueHandler = () => {
    // console.log("continuing purchase")
    this.setState({loading:true})
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.total_price,
      customer: {
        name: "Jesse Rahman",
        address:{
          street: "55 Broadway",
          zip: "10006",
          country: "USA"
        },
        email: "test_burgerbuilder@test.com",
        deliveryMethod: "fastest" 
      }
    }
    axios.post('/orders.json', order)
      .then(response => {
        console.log(response)
        this.setState({ loading: false, orderButtonClicked: false})
      })
      .catch(error => {
        console.log(error)
        this.setState({ loading: false, orderButtonClicked: false})
      });
  }

  addIngredient = (type) => {
    // get the current count for ingredient type
    const ingredient_current_count = this.state.ingredients[type];
    // get the new count for ingredient type
    const new_ingredient_count = ingredient_current_count + 1;
    // create copy of the ingredients objet
    const new_ingredients_object = {...this.state.ingredients};
    // set the count of the ingredient to the new ingredient count
    new_ingredients_object[type] = new_ingredient_count;
    const new_total_price = this.state.total_price + INGREDIENT_PRICES[type];
    this.setState({
      ingredients: new_ingredients_object,
      total_price: new_total_price
    });
    this.checkForEmptyBurger(new_ingredients_object)
  }

  removeIngredient = (type) => {
    // get current count 
    const current_ingredient_count = this.state.ingredients[type]
    // check current count of ingredient, make sure it doesn't go below 0

    let new_ingredient_count = current_ingredient_count;
    let new_total_price = this.state.total_price;

    if (current_ingredient_count !== 0){
      new_ingredient_count = current_ingredient_count - 1;
      new_total_price = this.state.total_price - INGREDIENT_PRICES[type];
    }
  
    // get current ingredient state
    const new_ingredients_object = {...this.state.ingredients}
    new_ingredients_object[type] = new_ingredient_count;
    // set new state
    this.setState({
      ingredients: new_ingredients_object,
      total_price: new_total_price
    })    
    this.checkForEmptyBurger(new_ingredients_object)
  }

  changeToBoolean = () => {
    const current_ingredients_object = {...this.state.ingredients}
    for (let ingredient in current_ingredients_object) {
      if (current_ingredients_object[ingredient] === 0) {
        current_ingredients_object[ingredient] = true
      } else {
        current_ingredients_object[ingredient] = false
      }
    }
    return current_ingredients_object
  }

  checkForEmptyBurger = (ingredients_object) => {
    // Always reset purchasable to false in case it was once true
    // If we don't reset it, then if a user add an item to cart it will become true
    // But if he/she removes the item, there's no method to make it false
    this.setState({ purchaseable: false })
    for (let ingredient in ingredients_object){
      if (ingredients_object[ingredient] !== 0) {
        this.setState({ purchaseable: true}) 
      }
    }
  }

  render() {
    // set order summary to null first bc it relies on ingredients which do not yet exist
    let order_summary = null 
    
    //  first set burger to the spinner bc it will be empty by default
    let burger = <Spinner />

    // if there are no ingredients, don't build a burger
    if (this.state.ingredients !== null) {
      burger = (
        <Aux>
          <Burger values={this.state.ingredients} />
          <BuildControls
            // when you don't use () you're just passing a reference to the function
            // the only time the function is called is when you called it with ()
            price={this.state.total_price}
            addIngredientProp={this.addIngredient}
            removeIngredientProp={this.removeIngredient}
            disabledButtonsProp={this.changeToBoolean()}
            isBurgerEmptyProp={this.state.purchaseable}
            orderButtonClickProp={this.orderButtonClick} />
        </Aux>
      );
      order_summary = <OrderSummary
        price={this.state.total_price}
        values={this.state.ingredients}
        closeModalProp={this.orderButtonClick}
        continuePurchaseProp={this.purchaseContinueHandler} />
    }

    if (this.state.loading === true) {
      order_summary = <Spinner />
    }
      
    return (
      <Aux>
        <Modal 
          show={this.state.orderButtonClicked} 
          backdropClickProp={this.orderButtonClick} >
          {order_summary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default BurgerBuilder;