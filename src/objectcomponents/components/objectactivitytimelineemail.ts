import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'object-activitiytimeline-email',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineemail.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineEmail implements OnInit {
    @Input() private activity: any = [];
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';
    private isopen: boolean = false;


    constructor(private model: model, private view: view, private metadata: metadata, private userpreferences: userpreferences) {
        this.view.isEditable = false;

        this.model.module = 'Emails';

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineEmail', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
    }

    get subject() {
        let subject = this.model.getField('name');
        return subject ? subject : '-- no subject --';
    }

    get time() {
        let startdate = this.model.getField('date_entered');
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get date() {
        let startdate = this.model.getField('date_entered');
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    private goDetail() {
        this.model.goDetail();
    }

    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}
