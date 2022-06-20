/**
 * @module ModuleWorkflow
 */
import {Component} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {model} from '../../../services/model.service';
import {WorkflowManagerService} from "../services/workflowmanager.service";

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
    public response: Observable<any>;
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
    /**
     * holds a backup of the task data
     */
    public taskBackup: any;

    constructor(private model: model, public workflowManagerService: WorkflowManagerService) {
        this.responseSubject = new Subject<any>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit() {
        this.taskBackup = JSON.stringify(this.task);
    }

    /**
     * close the modal
     */
    public cancel() {
        this.responseSubject.next(
            JSON.parse(this.taskBackup)
        );
        this.responseSubject.complete();
        this.self.destroy();
    }

    get tasktype(){
        return this.workflowManagerService.types.find(t => t.id == this.task.tasktype)?.name ?? '';
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

