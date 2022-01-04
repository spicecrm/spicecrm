/**
 * @module ModuleProjects
 */
import {Component, EventEmitter, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "project-activity-confirmation",
    templateUrl: "../templates/projectactivityconfirmation.html",
    providers: [model, view]
})
export class ProjectActivityConfirmation {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * the componentconfig
     */
    public componentconfig: any = {};


    /**
     * emits the action
     */
    public action: EventEmitter<any> = new EventEmitter<any>();


    constructor(
        public language: language,
        public metadata: metadata,
        @SkipSelf() public parent: model,
        public model: model,
        public view: view
    ) {

        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ProjectActivityConfirmation', 'ProjectActivities');

        this.view.isEditable = true;
        this.view.setEditMode('description');

    }

    public ngOnInit() {
        // load the last activities entered
        this.model.module = 'ProjectActivities';
        this.model.initialize(this.parent);

        let startDate = this.parent.getField('work_start');
        if (!startDate) {
            startDate = moment().subtract(1, 'hours');
        }

        this.model.setFields({
            activity_start: startDate,
            level_of_completion: this.parent.getField('level_of_completion'),
            activity_end: new moment()
        });
        this.model.startEdit();
    }

    /**
     * close the modal
     *
     * @private
     */
    public save() {
        if (this.model.validate()) {
            this.model.save().subscribe(saved => {
                this.action.emit('save');
                this.self.destroy();
            });
        }
    }

    /**
     * close the modal
     *
     * @private
     */
    public close() {
        this.action.emit('cancel');
        this.self.destroy();
    }

}
