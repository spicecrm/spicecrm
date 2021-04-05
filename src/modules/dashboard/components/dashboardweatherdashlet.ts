/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/dashboard/templates/dashboardweatherdashlet.html',
})
export class DashboardWeatherDashlet implements OnInit {

    private sortedDays: any[] = undefined;
    private cityName: string = undefined;
    private daytoshow: any[] = undefined;
    private dayHourToShow: any = undefined;
    private todayOnly: boolean = false; // can be assigned in the componentconfig
    private forecastCity: string = 'Vienna'; // can be assigned in the componentconfig
    private apiId: string = 'ba76af382fdb47888b5a080d6c7122b5'; // can be assigned in the componentconfig
    private isLoading: boolean = false;

    constructor(
        private http: HttpClient,
        private language: language,
        private metadata: metadata,
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

    private getForecastData(reqParams) {

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

    private resortDays(list) {
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

    private setDayToShow(day) {
        this.dayToShow = day;
    }

    private setDayHourToShow(dayHour) {
        this.dayHourToShow = dayHour;
    }

    private getHour(dt) {
        return moment.unix(dt).format('H') + ':00';
    }

    private getDayName(dt, short = false) {
        let dayIndex = new Date(dt * 1000).getDay();
        if (short) {
            return moment.weekdaysShort(dayIndex);
        }
        return moment.weekdays(dayIndex);
    }

    private getTemperature(temp) {
        return Math.round(parseInt(temp, 10) - 273.15);
    }

    private getWind(wind) {
        return Math.round(wind.speed * 3.6);

    }

    private getWeatherIconUrl(icon) {
        // private return `http://openweathermap.org/img/w/${icon}.png`;
        return 'proxy/?useurl=' + btoa(`http://openweathermap.org/img/w/${icon}.png`);
    }

    private trackByFn(index, item) {
        return index;
    }

}
