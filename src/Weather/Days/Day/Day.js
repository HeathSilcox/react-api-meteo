import React from 'react';
import './Day.css';

class Day extends React.Component {
    render() {
        return (
            <a href=".#" className={this.props.className} onClick={this.props.handleClick}>{this.props.day}</a>
        )
    }
}


export default Day;
