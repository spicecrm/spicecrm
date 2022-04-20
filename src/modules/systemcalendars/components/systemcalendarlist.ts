/**
 * @module ModuleHolidayCalendars
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from "../../../services/modellist.service";

@Component({
    selector: 'system-calendar-list',
    templateUrl: '../templates/systemcalendarlist.html',
    providers: [modellist, model]
})
export class SystemCalendarList implements OnInit {

    /**
     * the active calendar id
     * @private
     */
    private _activeCalendarID: string;

    /**
     * the actionset
     * @private
     */
    public actionset: string;

    constructor(
        private language: language,
        public modellist: modellist,
        private model: model,
        private metadata: metadata,
    ) {
        let componentconfig = this.metadata.getComponentConfig('HolidayCalendarList', 'SystemHolidayCalendars');
        this.actionset = componentconfig.actionset;
    }

    public ngOnInit() {
        this.modellist.initialize('SystemHolidayCalendars');
    }

    /**
     * reloads the calendar list
     * @private
     */
    public refresh() {
        this.activeCalendar = undefined;
        this.modellist.reLoadList();
    }

    /**
     * sets the active calendar ID
     * @param id
     */
    set activeCalendar(id) {
        this._activeCalendarID = id;
    }

    /**
     * gets the active calendar ID
     */
    get activeCalendar() {
        return this._activeCalendarID;
    }

    /**
     * adds a new calendar
     * @private
     */
    public addCalendar() {
        this.model.module = 'SystemHolidayCalendars';
        this.model.initialize();
        this.model.addModel();
    }

    /**
     * adds a new calendar
     * @private
     */
    public addDay() {
        this.model.module = 'SystemHolidayCalendarDays';
        this.model.initialize();
        this.model.addModel(null, null, {systemholidaycalendar_id: this.activeCalendar});
    }

}
