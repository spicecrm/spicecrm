import {Component, Input, OnInit} from '@angular/core';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { metadata } from '../../services/metadata.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-activitiytimeline-call',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinecall.html',
    providers:[model, view]
})
export class ObjectActivitiyTimelineCall implements OnInit{
    @Input() activity: any = {};
    @Input() showtoolset: boolean = true;

    formFields: Array<any> = [];
    formFieldSet: string = '';

    constructor(private model: model, private router: Router, private metadata: metadata, private view: view) {

        this.view.isEditable = false;

        this.model.module = 'Calls';
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineCall', this.model.module);
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