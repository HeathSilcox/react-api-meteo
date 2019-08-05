import React from 'react';
import './App.css';
import Header from './Header/Header';
import Weather from './Weather/Weather';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header />
                <div className="row">
                    <div className="col s12 m6 push-m3">
                        <Weather />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
