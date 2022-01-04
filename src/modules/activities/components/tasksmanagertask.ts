/**
 * @module ModuleActivities
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * displays a task in the task listz of the task managee
 */
@Component({
    selector: 'tasks-manager-task',
    templateUrl: '../templates/tasksmanagertask.html',
    providers: [model, view]
})
export class TasksManagerTask implements OnInit {

    /**
     * the task as input objects
     */
    @Input() public task: any = {};

    /**
     * the id of the current focusssed task
     */
    @Input() public focus: string = '';

    /**
     * emit the task id if the current task is selected
     */
    @Output() public taskselected: EventEmitter<string> = new EventEmitter<string>();

    /**
     * the fields to be displayed per the fieldset assigned
     */
    public fielsetFields: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model, public modelutilities: modelutilities, public view: view) {
        let componentconfig = this.metadata.getComponentConfig('TasksManagerTask', 'Tasks');
        if (componentconfig.fieldset) {
            this.fielsetFields = this.metadata.getFieldSetItems(componentconfig.fieldset);
        }

        // do not display field labels in this view
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = 'Tasks';
        this.model.id = this.task.id;
        this.model.setData(this.task);
    }

    /**
     * a getter to check if the task is completed
     */
    get isCompleted() {
        return this.model.getField('status') == 'Completed';
    }

    /**
     * acl check if the user cna edit the task
     */
    get canEdit() {
        return this.model.checkAccess('edit');
    }

    /**
     * return the style for the name field
     *
     * strikethrough if completed
     */
    get nameStyle() {
        let styles = {};

        if (this.isCompleted) {
            styles['text-decoration'] = 'line-through';
        }

        return styles;
    }

    get focusClass() {
        if (this.model.id == this.focus) {
            return 'slds-theme--shade slds-border--right';
        } else {
            return '';
        }
    }

    /**
     * complete the task with one click
     */
    public completeTask() {
        this.model.setField('status', 'Completed');
        this.model.save();
    }

    /**
     * select the task and emit the id
     */
    public selectTask() {
        this.taskselected.emit(this.model.id);
    }
}
