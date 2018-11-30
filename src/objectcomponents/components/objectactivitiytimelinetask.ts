import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-activitiytimeline-task',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinetask.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineTask implements OnInit {
    @Input() private activity: any = {};
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';
    private isopen: boolean = false;

    constructor(private metadata: metadata, private model: model, private view: view, private userpreferences: userpreferences) {

        this.view.isEditable = false;

        this.model.module = 'Tasks';
        this.model.initialize();

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineTask', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }


    get completed() {
        return this.model.getField('status') == 'Completed';
    }

    get canComplete() {
        if ((this.model.data.status === 'Completed' || this.model.data.status === 'Deferred') && this.model.checkAccess('edit')) {
            return false;
        } else {
            return true;
        }
    }

    get subject() {
        return this.model.getField('name');
    }

    get time() {
        let startdate = this.model.getField('date_start');
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get date() {
        let startdate = this.model.getField('date_start');
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    private goDetail() {
        this.model.goDetail();
    }

    private completeTask() {
        this.model.data.status = 'Completed';
        this.model.save();
    }
}