/**
 * @module ModuleWorkflow
 */
import {Component} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {WorkflowTaskType} from "../interfaces/workflow.interfaces";
import {WorkflowManagerService} from "../services/workflowmanager.service";

declare var _;

// @Output() public selectedItemChange: EventEmitter<any> = new EventEmitter<any>(); // need to output the mock array, return it back, and have an if statement execute absed on it

@Component({
    selector: 'workflow-manager-task-types-modal',
    templateUrl: './src/modules/workflow/templates/workflowmanagertasktypesmodal.html',
})

export class WorkflowManagerTaskTypesModal {

    public response: Observable<string>;
    public responseSubject: Subject<any>;
    public self: any = {};
    public selectedItem: WorkflowTaskType;
    public radioName: string = _.uniqueId('workflow_modal');

    constructor(private workflowManagerService: WorkflowManagerService) {
        this.responseSubject = new Subject<any>();
        this.response = this.responseSubject.asObservable();
    }

    /**
     * @return WorkflowTaskType[]
      */
    get types(): WorkflowTaskType[] {
        return this.workflowManagerService.types;
    }

    public cancel() {
        this.responseSubject.next();
        this.responseSubject.complete();
        this.self.destroy();
    }

    public confirm() {

        if (!this.selectedItem) return;

        this.responseSubject.next(this.selectedItem);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public trackByFn(index, item) {
        return index;
    }
}

