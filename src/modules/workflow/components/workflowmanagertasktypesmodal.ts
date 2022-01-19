/**
 * @module ModuleWorkflow
 */
import {Component} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {WorkflowTaskTypeI} from "../interfaces/workflow.interfaces";
import {WorkflowManagerService} from "../services/workflowmanager.service";

declare var _;

// @Output() public selectedItemChange: EventEmitter<any> = new EventEmitter<any>(); // need to output the mock array, return it back, and have an if statement execute absed on it

@Component({
    selector: 'workflow-manager-task-types-modal',
    templateUrl: '../templates/workflowmanagertasktypesmodal.html',
})

export class WorkflowManagerTaskTypesModal {

    /**
     * response observable
     */
    public response: Observable<string>;
    /**
     * response subject to emit the answer
     */
    public responseSubject: Subject<any>;
    public self: any = {};
    /**
     * holds the selected item
     */
    public selectedItem: WorkflowTaskTypeI;
    /**
     * holds the input radio name
     */
    public radioName: string = _.uniqueId('workflow_modal');
    /**
     * filter types to be displayed
     */
    public filterTypes: string[];

    constructor(private workflowManagerService: WorkflowManagerService) {
        this.responseSubject = new Subject<any>();
        this.response = this.responseSubject.asObservable();
        this.selectedItem = this.workflowManagerService.types[0];
    }

    /**
     * @return WorkflowTaskTypeI[]
      */
    get types(): WorkflowTaskTypeI[] {
        return !Array.isArray(this.filterTypes) ?
            this.workflowManagerService.types :
            this.workflowManagerService.types.filter(t => this.filterTypes.indexOf(t.type) > -1);
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

        if (!this.selectedItem) return;

        this.responseSubject.next(this.selectedItem);
        this.responseSubject.complete();
        this.self.destroy();
    }

    /**
     * help performance
     * @param index
     * @param item
     */
    public trackByFn(index, item) {
        return index;
    }
}

