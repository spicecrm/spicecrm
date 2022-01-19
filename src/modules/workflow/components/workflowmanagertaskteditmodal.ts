/**
 * @module ModuleWorkflow
 */
import {Component} from "@angular/core";
import {Observable, Subject} from "rxjs";

/**
 * modal for editing task data
 */
@Component({
    selector: 'workflow-manager-task-edit-modal',
    templateUrl: '../templates/workflowmanagertaskeditmodal.html',
})

export class WorkflowManagerTaskEditModal {
    /**
     * response observable
     */
    public response: Observable<string>;
    /**
     * response subject to emit the answer
     */
    public responseSubject: Subject<any>;
    /**
     * reference of this component
     */
    public self: any = {};
    /**
     * task data
     */
    public task: any;

    constructor() {
        this.responseSubject = new Subject<any>();
        this.response = this.responseSubject.asObservable();
    }

    /**
     * close the modal
     */
    public cancel() {
        this.responseSubject.next();
        this.responseSubject.complete();
        this.self.destroy();
    }

    /**
     * emit the selected item
     */
    public confirm() {

        this.responseSubject.next(this.task);
        this.responseSubject.complete();
        this.self.destroy();
    }
}

