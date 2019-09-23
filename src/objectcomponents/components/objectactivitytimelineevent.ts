/**
 * @module ObjectComponents
 */
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {userpreferences} from '../../services/userpreferences.service';

declare var moment: any;

/**
 * a generic component to display an event in the activity timeline
 */
@Component({
    selector: 'object-activitiytimeline-event',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineevent.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineEvent implements OnInit {
    /**
     * the activity
     */
    @Input() private activity: any = {};

    /**
     * defines if the toolset/actonset icon shoudl be displayed
     *
     * defaults to true
     */
    @Input() private showtoolset: boolean = true;

    /**
     * the fieldset to be displayed
     */
    private formFieldSet: string = '';

    /**
     * internal variable if the event pane is open or collapsed
     */
    private isopen: boolean = false;

    constructor(private model: model, private userpreferences: userpreferences, private metadata: metadata, private view: view) {

        // is by default not editable
        this.view.isEditable = false;

        this.model.module = 'Meetings';
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineEvent', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
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

    get subject() {
        return this.model.getField('name');
    }

    get starttime() {
        let startdate = new moment(this.model.getField('date_start'));
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get startdate() {
        let startdate = new moment(this.model.getField('date_start'));
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }


    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}