import {Component, Input, OnInit} from '@angular/core';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { metadata } from '../../services/metadata.service';

@Component({
    selector: 'object-activitiytimeline-note',
    templateUrl: './app/objectcomponents/templates/objectactivitiytimelinenote.html',
    providers:[model, view]
})
export class ObjectActivitiyTimelineNote implements OnInit{
    @Input() activity: any = [];
    @Input() showtoolset: boolean = true;

    formFields: Array<any> = [];
    formFieldSet: string = '';


    constructor(private model: model, private view: view, private metadata: metadata) {
        this.view.isEditable = false;

        this.model.module = 'Notes';

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineNote', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
        this.formFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    ngOnInit(){
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    goDetail(){
        this.model.goDetail();
    }
}