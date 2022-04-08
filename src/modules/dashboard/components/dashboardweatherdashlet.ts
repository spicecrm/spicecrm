/**
 * @module ModuleDashboard
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {HttpClient} from "@angular/common/http";

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: '../templates/dashboardweatherdashlet.html',
})
export class DashboardWeatherDashlet implements OnInit {

    public sortedDays: any[] = undefined;
    public cityName: string = undefined;
    public daytoshow: any[] = undefined;
    public dayHourToShow: any = undefined;
    public todayOnly: boolean = false; // can be assigned in the componentconfig
    public forecastCity: string = 'Vienna'; // can be assigned in the componentconfig
    public apiId: string = 'ba76af382fdb47888b5a080d6c7122b5'; // can be assigned in the componentconfig
    public isLoading: boolean = false;

    constructor(
        public http: HttpClient,
        public language: language,
        public metadata: metadata,
    ) {
    }

    get dayToShow() {
        return this.daytoshow;
    }

    set dayToShow(value) {
        this.daytoshow = value;
        this.dayHourToShow = value.length == 8 ? value[4] : value[0];
    }

    get description() {
        if (this.dayHourToShow) {
            let lowerDesc = this.dayHourToShow.weather[0].description.split(' ');
            let capsDesc = [];
            for (let word of lowerDesc) {
                capsDesc.push(word.replace(/\S/, (m) => m.toUpperCase()));
            }
            return capsDesc.join(' ');
        }
    }

    public ngOnInit() {

        let componentConfig = this.metadata.getComponentConfig('DashboardWeatherDashlet', 'Dashboards');

        if (componentConfig.hasOwnProperty('apiid')) {
            this.apiId = componentConfig.apiid;
        }

        if (componentConfig.hasOwnProperty('city') && componentConfig.city != '') {
            this.getForecastData('q=' + componentConfig.city);
        } else {
            if (navigator.geolocation) {
                this.isLoading = true;
                navigator.geolocation.getCurrentPosition(
                    position => {
                        let geo: string = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
                        this.getForecastData(geo);
                    }, err => {
                        if (err.code == err.PERMISSION_DENIED)
                            this.getForecastData('q=' + this.forecastCity);
                        this.isLoading = false;
                    });
            }
        }

        this.todayOnly = componentConfig.hasOwnProperty('todayonly') ? componentConfig.todayonly : false;
    }

    public getForecastData(reqParams) {

        this.isLoading = true;
        this.http.get('proxy/?useurl=' + btoa(`http://api.openweathermap.org/data/2.5/forecast?${reqParams}&APPID=${this.apiId}`))
            .subscribe(
                (res: any) => {
                    if (res.city) {
                        this.cityName = res.city.name;
                    }
                    if (res.list) {
                        this.resortDays(res.list);
                    }
                }
            );
        this.isLoading = false;
    }

    public resortDays(list) {
        if (list) {
            let daysArray = [];
            let dayTimesArray = [];
            let daysList = list.sort((a, b) => a.dt - b.dt);
            let dayIndex = new Date(daysList[0].dt * 1000).getDay();

            for (let item of daysList) {
                let itemDayIndex = new Date(item.dt * 1000).getDay();
                if (dayIndex == itemDayIndex) {
                    dayTimesArray.push(item);
                } else {
                    dayIndex = itemDayIndex;
                    daysArray.push(dayTimesArray);
                    dayTimesArray = [];
                    dayTimesArray.push(item);
                }
            }
            this.sortedDays = daysArray;
            this.dayToShow = daysArray[0];
        }
    }

    public setDayToShow(day) {
        this.dayToShow = day;
    }

    public setDayHourToShow(dayHour) {
        this.dayHourToShow = dayHour;
    }

    public getHour(dt) {
        return moment.unix(dt).format('H') + ':00';
    }

    public getDayName(dt, short = false) {
        let dayIndex = new Date(dt * 1000).getDay();
        if (short) {
            return moment.weekdaysShort(dayIndex);
        }
        return moment.weekdays(dayIndex);
    }

    public getTemperature(temp) {
        return Math.round(parseInt(temp, 10) - 273.15);
    }

    public getWind(wind) {
        return Math.round(wind.speed * 3.6);

    }

    public getWeatherIconUrl(icon) {
        // public return `http://openweathermap.org/img/w/${icon}.png`;
        return 'proxy/?useurl=' + btoa(`http://openweathermap.org/img/w/${icon}.png`);
    }

    public trackByFn(index, item) {
        return index;
    }

}
