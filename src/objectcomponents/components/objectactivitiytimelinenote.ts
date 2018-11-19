import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-activitiytimeline-note',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinenote.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineNote implements OnInit {
    @Input() private activity: any = [];
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';
    private isopen: boolean = false;


    constructor(private model: model, private view: view, private metadata: metadata, private userpreferences: userpreferences) {
        this.view.isEditable = false;

        this.model.module = 'Notes';

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineNote', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    private goDetail() {
        this.model.goDetail();
    }

    get subject() {
        return this.model.getField('name');
    }

    get time() {
        let startdate = this.model.getField('date_entered');
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get date() {
        let startdate = this.model.getField('date_entered');
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    private toggleopen() {
        this.isopen = !this.isopen;
    }
}
