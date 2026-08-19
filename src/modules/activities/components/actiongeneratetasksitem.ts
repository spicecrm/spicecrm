/**
 * @module ModuleActivities
 */
import {Component, Input, OnDestroy, OnInit, SkipSelf, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {view} from "../../../services/view.service";
import moment from "moment";

/**
 * renders a modal to generate tasks wit AI
 */
@Component({
    selector: 'action-generate-tasks-item',
    templateUrl: '../templates/actiongeneratetasksitem.html',
    standalone: false,
    providers: [model, view]
})
export class ActionGenerateTasksItem implements OnInit{

    /**
     * the task we generate
     */
    @Input() public task: any;

    public componentconfig: any;

    public hidden: boolean = false;

    public saving: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public view: view,
        @SkipSelf() public parent: model,
        public modal: modal,
        public backend: backend
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // get the fieldset
        this.componentconfig = this.metadata.getComponentConfig('ActionGenerateTasksItem', 'Tasks');

        // initialize zthe model
        this.model.module = 'Tasks';
        this.model.id = this.task.id;
        this.model.initialize(this.parent);

        // set general fields
        this.model.setFields({
            name: this.task.name,
            description: this.task.description,
            date_due: this.task.date_due ? moment(this.task.date_due + ' 12:00:00') : moment()
        })

        // set the assigned user
        if(this.task.assigned_user_id){
            this.model.setFields({
                assigned_user_id: this.task.assigned_user_id,
                assigned_user: this.task.assigned_user,
            })
        }
    }

    public hide(){
        this.hidden = true;
    }

    public save(){
        this.saving = true;
        this.model.save().subscribe({
            next: (r) => {
                this.hide();
                this.saving = false;
            }
        })
    }
}
