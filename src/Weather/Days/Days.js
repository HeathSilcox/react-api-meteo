import React from 'react';
import Day from './Day/Day';
import './Days.css';
import moment from 'moment';

class Days extends React.Component {
    createDay(n) {
        const day = moment().add(n, 'days').format('dddd');
        // Si c'est le premier jour (0), on le met en gras par défaut.
        if (n === 0) {
            return(
                <Day day={day} className="active" handleClick={this.props.handleClick.bind(this, n)} />
            )
        }

        return(
            <Day day={day} handleClick={this.props.handleClick.bind(this, n)} />
        )
    }

    render() {
        return (
            <div className="card-action">
                {this.createDay(0)}
                {this.createDay(1)}
                {this.createDay(2)}
                {this.createDay(3)}
                {this.createDay(4)}
            </div>
        )
    }
}

export default Days;
