/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';

declare var moment: any;

@Component({
    selector: 'object-activitiytimeline-item',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineitem.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineItem implements OnInit {
    @Input() private activity: any = {};
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';
    private isopen: boolean = false;

    public componentconfig: any = {};

    constructor(private model: model, private metadata: metadata, private view: view, private userpreferences: userpreferences) {
        this.view.isEditable = false;
    }

    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns the subject
     */
    get subject() {
        let subject = this.model.getField('summary_text');
        return subject ? subject : '-- no subject --';
    }

    /**
     * gets the activity time and returns it formatted
     */
    get starttime() {
        let startdate = new moment(this.activity.date_activitiy);
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    /**
     * gets the activity date and returns it formatted
     */
    get startdate() {
        let startdate = new moment(this.activity.date_activitiy);
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
        this.model.module = this.activity.module;
        this.componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineItem', this.model.module);
        this.formFieldSet = this.componentconfig.fieldset;
    }

    /**
     * returns true if no fieldset for the expanded form is set and thus expanding is not possible
     */
    get cantexpand() {
        return this.formFieldSet == '';
    }

    /**
     * checks modsl ACL rules and if allowed enables get details
     */
    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    /**
     * navigate to the records
     */
    private goDetail() {
        if (this.enableDetail) this.model.goDetail();
    }

    /**
     * toggles teh state between expanded and collapsed
     */
    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}
