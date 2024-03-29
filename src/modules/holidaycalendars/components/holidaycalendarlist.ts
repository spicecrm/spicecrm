/**
 * @module ModuleHolidayCalendars
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from "../../../services/modellist.service";

@Component({
    selector: 'holiday-calendar-list',
    templateUrl: '../templates/holidaycalendarlist.html',
    providers: [modellist, model]
})
export class HolidayCalendarList implements OnInit {

    /**
     * the active calendar id
     * @private
     */
    public _activeCalendarID: string;

    /**
     * the actionset
     * @private
     */
    public actionset: string;

    constructor(
        public language: language,
        public modellist: modellist,
        public model: model,
        public metadata: metadata,
    ) {
        let componentconfig = this.metadata.getComponentConfig('HolidayCalendarList', 'SystemHolidayCalendars');
        this.actionset = componentconfig.actionset;
    }

    public ngOnInit() {
        this.modellist.initialize('SystemHolidayCalendars');
        this.modellist.getListData();
        this.model.module = "SystemHolidayCalendars";
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
        this.model.id = '';
        this.model.initialize();
        this.model.addModel();
    }

    /**
     * adds a new calendar
     * @private
     */
    public addDay() {
        this.model.module = 'SystemHolidayCalendarDays';
        this.model.id = '';
        this.model.initialize();
        this.model.addModel(null, null, {systemholidaycalendar_id: this.activeCalendar});
    }

}
