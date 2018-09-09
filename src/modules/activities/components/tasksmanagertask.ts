import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tasks-manager-task',
    templateUrl: './app/modules/activities/templates/tasksmanagertask.html',
    providers: [model, view]
})
export class TasksManagerTask implements OnInit{

    @Input() task: any = {};
    @Input() focus: string = '';
    @Output() taskselected: EventEmitter<string> = new EventEmitter<string>();

    fielsetFields: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private modelutilities: modelutilities, private view: view) {
        let componentconfig = this.metadata.getComponentConfig('TasksManagerTask', 'Tasks');
        if(componentconfig.fieldset){
            this.fielsetFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        }
    }

    ngOnInit(){
        this.model.module = 'Tasks';
        this.model.id = this.task.id;
        this.model.data = this.modelutilities.backendModel2spice('Tasks', this.task);
    }

    get isCompleted(){
        return this.model.data.status == 'Completed';
    }

    get canEdit(){
        return this.model.data.acl.edit;
    }

    get nameStyle(){
        let styles = {};

        if(this.isCompleted)
            styles['text-decoration'] = 'line-through';

        return styles;
    }

    get focusClass(){
        if(this.model.id == this.focus)
            return 'slds-theme--shade slds-border--right';
        else
            return '';
    }

    completeTask(){
        this.model.data.status = 'Completed';
        this.model.save();
    }

    selectTask(){
        this.taskselected.emit(this.model.id);
    }
}