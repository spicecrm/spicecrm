import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { broadcast } from '../../services/broadcast.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-activitiytimeline-task',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinetask.html',
    providers:[model, view]
})
export class ObjectActivitiyTimelineTask implements OnInit{
    @Input() activity: any = {};
    @Input() showtoolset: boolean = true;

    formFields: Array<any> = [];
    formFieldSet: string = '';

    constructor(private metadata: metadata, private model: model, private view: view, private router: Router) {

        this.view.isEditable = false;

        this.model.module = 'Tasks';
        this.model.initialize();

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineTask', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
        this.formFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    ngOnInit(){
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }


    canComplete(){
        if((this.model.data.status === 'Completed' || this.model.data.status === 'Deferred') && this.model.checkAccess('edit'))
            return false;
        else
            return true;
    }

    get enableDetail(){
        return this.model.checkAccess('detail');
    }

    goDetail(){
        this.model.goDetail();
    }

    completeTask(){
        this.model.data.status = 'Completed';
        this.model.save();
    }
}