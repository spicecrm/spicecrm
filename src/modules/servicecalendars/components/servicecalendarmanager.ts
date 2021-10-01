/**
 * @module ServiceCalendarManager
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from "../../../services/modellist.service";

@Component({
    selector: 'service-calendar-manager',
    templateUrl: './src/modules/servicecalendars/templates/servicecalendarmanager.html',
    providers: [modellist, model]
})
export class ServiceCalendarManager implements OnInit {

    /**
     * the actionset
     * @private
     */
    public actionset: string;
    /**
     * the active calendar id
     * @private
     */
    private _activeCalendarID: string;

    constructor(
        private language: language,
        public modellist: modellist,
        private model: model,
        private metadata: metadata,
    ) {
        let componentconfig = this.metadata.getComponentConfig('ServiceCalendarManager', 'ServiceCalendars');
        this.actionset = componentconfig.actionset;
    }

    /**
     * gets the active calendar ID
     */
    get activeCalendar() {
        return this._activeCalendarID;
    }

    /**
     * sets the active calendar ID
     * @param id
     */
    set activeCalendar(id) {
        this._activeCalendarID = id;
    }

    public ngOnInit() {
        this.model.module = 'ServiceCalendars';
        this.modellist.initialize('ServiceCalendars');
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
     * adds a new calendar
     * @private
     */
    public addCalendar() {
        this.model.initialize();
        this.model.addModel();
    }

    /**
     * adds a new calendar
     * @private
     */
    public addDay() {
        this.model.module = 'ServiceCalendarTimes';
        this.model.initialize();
        this.model.addModel(null, null, {servicecalendar_id: this.activeCalendar});
    }

}
