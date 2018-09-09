import {Component, Input, OnInit} from '@angular/core';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { metadata } from '../../services/metadata.service';

@Component({
    selector: 'object-activitiytimeline-email',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineemail.html',
    providers:[model, view]
})
export class ObjectActivitiyTimelineEmail implements OnInit{
    @Input() activity: any = [];
    @Input() showtoolset: boolean = true;

    formFields: Array<any> = [];
    formFieldSet: string = '';


    constructor(private model: model, private view: view, private metadata: metadata) {
        this.view.isEditable = false;

        this.model.module = 'Emails';

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineEmail', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
        this.formFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    ngOnInit(){
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    get enableDetail(){
        return this.model.checkAccess('detail');
    }

    goDetail(){
        this.model.goDetail();
    }
}