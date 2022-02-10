/**
 * @module ModuleWorkflow
 */
import {AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";
import {WorkflowDiagramService} from "../services/workflowdiagram.service";
import {view} from "../../../services/view.service";

/**
 * @ignore
 */
declare var _;

/**
 * manage workflow and tasks definitions
 */
@Component({
    selector: 'workflow-manager',
    templateUrl: '../templates/workflowmanager.html',
    providers: [WorkflowManagerService, model, view, WorkflowDiagramService]
})
export class WorkflowManager implements OnInit, AfterViewInit {
    /**
     * if true stretch the container view
     */
    public stretch = false;
    /**
     * holds the system modules
     */
    public modules = [];
    /**
     * holds the current workflow definition
     */
    public currentWorkflow: { id: string, data: any };
    /**
     * true while loading the workflow definitions
     */
    public isLoading: boolean = false;
    /**
     * reference to the diagram container
     */
    @ViewChild('diagramContainer', {read: ElementRef}) diagramContainer: ElementRef;
    /**
     * if true display diagram
     */
    public displayDiagram: boolean = true;

    constructor(public backend: backend,
                public metadata: metadata,
                public language: language,
                public utils: modelutilities,
                public modal: modal,
                public toast: toast,
                public configurationService: configurationService,
                public workflowDiagramService: WorkflowDiagramService,
                public model: model,
                public injector: Injector,
                public view: view,
                public workflowManagerService: WorkflowManagerService) {
    }

    /**
     * @return any[] the current workflow definitions
     */
    get currentWorkflowDefinitions(): any[] {
        return this.workflowManagerService.currentModule?.workflowDefinitions;
    }

    /**
     * @return any the current module
     */
    get currentModule(): string {
        return this.workflowManagerService.currentModule?.name;
    }

    /**
     * set the current module
     * @param val
     */
    set currentModule(val: string) {

        this.currentWorkflowId = undefined;

        this.model.resetData();

        if (!val) {
            this.workflowManagerService.currentModule = undefined;
            return;
        }

        this.workflowManagerService.currentModule = {
            name: val,
            workflowDefinitions: [],
            fields: this.getModuleFields(val)
        };
        this.getWorkflowDefinitions();
    }

    /**
     * @return string the current workflow id
     */
    get currentWorkflowId(): string {
        return this.currentWorkflow?.id;
    }

    /**
     * set the current workflow
     * @param id
     */
    set currentWorkflowId(id: string) {

        this.model.id = id;

        if (!id) {

            this.model.data = {};
            this.workflowManagerService.tasks = [];
            this.currentWorkflow = undefined;
            if (this.model.isNew) this.removeCurrentWorkflowFromList();

            this.workflowDiagramService.clearDiagramData();

        } else {

            this.model.setData(
                this.getCurrentWorkflowData(id)
            );

            this.workflowManagerService.tasks = this.model.data.tasks;

            this.currentWorkflow = { id, data: this.model.data };


            if (!this.workflowManagerService.hasStartTask()) {
                this.generateStartTask();
            }

            this.workflowDiagramService.reloadDiagramData(this.displayDiagram);
        }

    }

    /**
     * call to load the workflow task types
     * set the system modules from metadata
     */
    public ngOnInit() {
        this.loadTypes();
        this.modules = this.metadata.getModules().sort();
        this.model.module = 'WorkflowDefinitions';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * load the diagram
     */
    public ngAfterViewInit() {
        this.workflowDiagramService.loadDiagram(this.diagramContainer.nativeElement);
    }

    /**
     * create new workflow
     */
    public addWorkflow() {

        const newWorkflow = {
            id: this.utils.generateGuid(),
            isNew: true,
            workflowdefinition_module: this.currentModule,
            is_active: 0,
            frequency: 'always',
            workflowdefinition_precond: 'a',
            tasks: [],
            conditions: []
        };

        this.modal.openModal('WorkflowManagerEditModal', true, this.injector).subscribe(modalRef => {

            modalRef.instance.workflowData = newWorkflow;

            modalRef.instance.response.subscribe({
                next: modalData => {
                    if (!modalData) return;
                    this.model.setData(modalData);
                    this.model.id = newWorkflow.id;
                    this.workflowManagerService.currentModule.workflowDefinitions.push(
                        modalData
                    );
                    this.currentWorkflowId = newWorkflow.id;
                }
            });
        });
    }

    /**
     * save the workflow definitions
     */
    public save() {

        const data = this.utils.spiceModel2backend('WorkflowDefinitions', this.model.data);
        data.tasks = data.tasks.map(task => this.utils.spiceModel2backend('WorkflowTaskDefinitions', task));

        this.backend.postRequest(`module/WorkflowDefinitions/${this.currentModule}/${this.currentWorkflowId}`, {}, data).subscribe(
            () => {
                this.model.data.isNew = false;
                this.currentWorkflow.data.isNew = false;

                this.toast.sendToast('data saved', 'success');
            },
            () => {
                this.toast.sendAlert('saving changes failed!', 'error');
            }
        );
    }

    /**
     * delete workflow and its tasks
     */
    public deleteWorkflow() {

        this.modal.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('LBL_DELETE')).subscribe(answer => {

            if (!answer) return;

            this.backend.deleteRequest(`module/WorkflowDefinitions/${this.currentWorkflowId}`).subscribe(
                (res: { success: boolean, message: string }) => {

                    if (res.success) {
                        this.toast.sendToast('Workflow deleted', 'success');
                        this.removeCurrentWorkflowFromList();
                        this.currentWorkflowId = undefined;
                        this.workflowManagerService.tasks = [];
                    } else {
                        this.toast.sendToast(res.message, 'error');
                    }
                },
                () => {
                    this.toast.sendToast('deleting Workflow failed!', 'error');
                }
            );
        });
    }

    /**
     * get module fields
     * @param module
     */
    public getModuleFields(module: string): { name: string, label: string }[] {

        return _.toArray(this.metadata.getModuleFields(module))
            .map(f => ({
                name: f.name,
                label: this.language.getFieldDisplayName(module, f.name)
            }))
            .sort((a, b) => {
                return a.label > b.label ? 1 : -1;
            });
    }

    /**
     * remove current workflow from list
     * @private
     */
    public removeCurrentWorkflowFromList() {
        this.workflowManagerService.currentModule.workflowDefinitions = this.workflowManagerService.currentModule.workflowDefinitions.filter(e => e.id != this.model.id);
    }

    /**
     * load the workflow task types from backend
     * @private
     */
    public loadTypes() {
        const types = this.configurationService.getData('workflowtasktypes');
        this.workflowManagerService.types = Array.isArray(types) ? types : [];
    }

    /**
     * get workflow definitions for the current module
     * @private
     */
    public getWorkflowDefinitions() {

        this.isLoading = true;

        this.backend.getRequest('module/WorkflowDefinitions/' + this.currentModule).subscribe(wfd => {
            this.isLoading = false;
            this.workflowManagerService.currentModule.workflowDefinitions = wfd;
        }, () => {
            this.isLoading = false;
        });
    }

    /**
     * get the current workflow data
     * @param id
     * @private
     */
    public getCurrentWorkflowData(id: string): any {
        const data = this.workflowManagerService.currentModule.workflowDefinitions.find(data => data.id == id);
        data.tasks = data.tasks.map(task => this.utils.backendModel2spice('WorkflowTaskDefinitions', {...task}));
        return {...data};
    }

    /**
     * open workflow definition edit modal
     */
    public openEditModal() {

        this.modal.openModal('WorkflowManagerEditModal', true, this.injector).subscribe(modalRef => {

            modalRef.instance.workflowData = this.model.data;

            modalRef.instance.response.subscribe({
                next: modalData => {
                    if (!modalData) return;
                    this.model.setData(modalData);
                    this.workflowManagerService.currentModule.workflowDefinitions =
                        [...this.workflowManagerService.currentModule.workflowDefinitions.filter(w => w.id != modalData.id), modalData];
                }
            });
        });
    }

    /**
     * generate start task
     * @private
     */
    private generateStartTask() {
        const startTask = this.workflowManagerService.generateNewTask(
            this.workflowManagerService.getStartType().id
        );
        this.workflowManagerService.tasks.push(startTask);
        this.workflowManagerService.openEditModal(startTask.id);
    }

    /**
     * toggle show diagram
     * @param value
     */
    public toggleActivateDiagram(value: boolean) {

        if (value) {
            this.workflowDiagramService.activate();
        } else {
            this.workflowDiagramService.deactivate();
        }
    }

    /**
     * toggle activating the workflow
     * @param value
     */
    public toggleActive(value: boolean) {

        this.model.data.is_active = value;

        if (value && !this.workflowManagerService.hasAllEndTasks()) {
            this.toast.sendToast(this.language.getLabel('MSG_MISSING_WORKFLOW_ENDING'), 'warning');
            this.model.data.is_active = false;
        }
    }

    /**
     * toggle stretch bool
     */
    public toggleStretch() {
        this.stretch = !this.stretch;
    }
}
