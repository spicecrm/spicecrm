import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { userpreferences } from '../../services/userpreferences.service';

@Component({
    selector: 'object-activitiytimeline-event',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineevent.html',
    providers:[model, view]
})
export class ObjectActivitiyTimelineEvent implements OnInit{
    @Input() private activity: any = {};
    @Input() private showtoolset: boolean = true;

    private formFieldSet: string = '';
    private isopen: boolean = false;

    constructor(private model: model, private userpreferences: userpreferences, private metadata: metadata, private view: view) {

        this.view.isEditable = false;

        this.model.module = 'Meetings';
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineEvent', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
    }

    public ngOnInit(){
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
    }

    get enableDetail(){
        return this.model.checkAccess('detail');
    }

    private goDetail(){
        this.model.goDetail();
    }

    get subject() {
        return this.model.getField('name');
    }

    get starttime() {
        let startdate = this.model.getField('date_start');
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    get startdate() {
        let startdate = this.model.getField('date_start');
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }


    private toggleexpand() {
        this.isopen = !this.isopen;
    }
}