/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-activitiytimeline-call',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinecall.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineCall implements OnInit {
    @Input() private activity: any = {};
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';
    private isopen: boolean = false;

    constructor(private model: model, private metadata: metadata, private view: view, private userpreferences: userpreferences) {

        this.view.isEditable = false;

        this.model.module = 'Calls';
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineCall', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
    }

    get subject() {
        let subject = this.model.getField('name');
        return subject ? subject : '-- no subject --';
    }

    get starttime() {
        let startdate = this.model.getField('date_start');
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get startdate() {
        let startdate = this.model.getField('date_start');
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    private goDetail() {
        this.model.goDetail();
    }

    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}
