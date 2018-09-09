import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-activitiytimeline-event',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineevent.html',
    providers:[model, view],
    host:{
        'class' : 'slds-timeline__item'
    }
})
export class ObjectActivitiyTimelineEvent implements OnInit{
    @Input() activity: any = {};
    @Input() showtoolset: boolean = true;

    formFields: Array<any> = [];
    formFieldSet: string = '';

    constructor(private model: model, private router: Router, private metadata: metadata, private view: view) {

        this.view.isEditable = false;

        this.model.module = 'Calls';
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineEvent', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
        this.formFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    ngOnInit(){
        this.model.module = 'Meetings';
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