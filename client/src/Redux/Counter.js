import React, { Component } from 'react';
import {increment, decrement} from './Action.js';
import { connect } from "react-redux";

 class Counter extends Component {

increment = () => {
    this.props.increment();
}

    decrement = () => {
        this.props.decrement();
    }

    render() {
        return (
            <div>
                <p>This is our counter : {this.props.count}</p>
                <button onClick={this.increment}>Increment</button>
                <button onClick={this.decrement}>Decrement</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    count : state.count
})

const mapDispatchToProps = {
    increment,
    decrement
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);