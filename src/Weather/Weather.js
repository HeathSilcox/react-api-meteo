import React from 'react';
import Days from './Days/Days';
import './Weather.css';
import iconTable from './iconmapping';

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.apiKey = '';
        this.forecastUri = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + this.apiKey;
        this.currentUri = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + this.apiKey;

        this.state = {
            icon: '',
            temp: '',
            wind: {
                speed: '',
            },
            cityName: '',
            day: 0,
            weatherReports: [],
        };

        this.fetchWeatherData();
        this.filterWeatherReports();
    }

    async fetchWeatherData(day = 0) {
        // Coucou Nico, si tu passes par là, je veux bien que tu fasses marcher avec
        // this.state.day, car je n'ai pas réussi c'était vraiment chiant, merci ^-^
        switch (day) {
            case 0:
                await this.fetchCurrentWeatherData();
                break;

            case 1:
                this.setEverythingForNthDay(1);
                break;

            case 2:
                this.setEverythingForNthDay(2);
                break;

            case 3:
                this.setEverythingForNthDay(3);
                break;

            case 4:
                this.setEverythingForNthDay(4);
                break;

            default:
                break;
        }
    }

    setEverythingForNthDay(n) {
        // Tableau de référence qui permet de calculer dynamiquement
        // le weatherReport à extraire selon le jour.
        const reportLimits = {
            0: 0,
            1: 8,
            2: 16,
            3: 24,
            4: 32,
        };
        const sumReducer = (acc, curr) => acc + curr;

        // On renvoie un tableau des 8 bulletins du jour concerné.
        const weatherReportsOfTheDay = this.state.weatherReports.slice(reportLimits[n-1], reportLimits[n]);

        // On renvoie un tableau des températures de ces bulletins.
        const tempsOfTheDay = weatherReportsOfTheDay.map(report => report.main.temp);

         // On fait la somme et on divise par 8 pour avoir une moyenne.
        const averageTempOfTheDay = tempsOfTheDay.reduce(sumReducer) / 8;

        // On cherche grâce à la regex le rapport de midi et on récupère l'id de l'icône
        // de ce rapport.
        const regex = /\d{4}-\d{2}-\d{2}\s12:00:00/;
        let noonIconOfTheDay = '';
        weatherReportsOfTheDay.some(report => {
            if(report.dt_txt.match(regex)) {
                noonIconOfTheDay = report.weather[0].id;
                return true;
            }
        });

        const windSpeedsOfTheDay = weatherReportsOfTheDay.map(report => report.wind.speed);
        const averageWindSpeedsOfTheDay = windSpeedsOfTheDay.reduce(sumReducer) / 8;


        this.setState({
            temp: averageTempOfTheDay,
            icon: iconTable[noonIconOfTheDay],
            wind: {
                speed: averageWindSpeedsOfTheDay,
            },
        });
    }

    async filterWeatherReports() {
        const response = await fetch(this.forecastUri + '&q=Roanne,fr');
        const dataJson = await response.json();

        // On cherche à avoir le 2ème jour parmi toute la liste
        // des bulletins météo.
        const regex = /\d{4}-\d{2}-\d{2}\s00:00:00/;
        let index = 0;

        // On utilise Array.some afin de pouvoir sortir de la
        // boucle après avoir match la regex.
        // index contient l'indice du premier bulletin du 2ème jour.
        dataJson.list.some((report, n) => {
            if (report.dt_txt.match(regex)) {
                index = n;
                return index;
            }
        });

        // Contient la liste de tous les bulletins à partir du
        // 2ème jour.
        this.setState({
            weatherReports: dataJson.list.slice(index),
        });
    }

    async fetchCurrentWeatherData() {
        const response = await fetch(this.currentUri + '&q=Roanne,fr');
        const dataJson = await response.json();

        this.setState({
            icon: iconTable[dataJson.weather[0].id], // On utilise la table de référence pour trouver l'icône correspondante.
            temp: dataJson.main.temp,
            wind: {speed: dataJson.wind.speed},
            cityName: dataJson.name
        });
    }

    static manageBoldLinks(evt) {
        // Lorsqu'on clique sur un jour on désactive le texte gras de tous les jours.
        const days = document.querySelectorAll('.card-action a');
        days.forEach(day => {
            day.classList.remove('active');
        });
        // Lorsqu'on clique sur un jour on le met en gras.
        evt.target.classList.add('active');
    }

    handleClick(day, evt) {
        Weather.manageBoldLinks(evt);
        this.setState({
            day: day,
        });
        this.fetchWeatherData(day);
    }

    render() {
        return (
            <div className="weather card blue-grey darken-1">
                <div className="card-content white-text">
                    <span className="card-title">{this.state.cityName}</span>
                    <p><img src={"icons/" + this.state.icon} alt=""/></p>
                    <span className="temperature">{Math.round(this.state.temp)}°C</span>
                    <div className="wind">Vent {Math.round(this.state.wind.speed * 3.6)} km/h</div>
                </div>
                <Days handleClick={this.handleClick.bind(this)}/>
            </div>
        )
    }
}

export default Weather;
