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
     * getter for the dioagram setting from the manager service
     */
    get displayDiagram(){
        return this.workflowManagerService.displayDiagram;
    }

    /**
     * setter for the dioagram setting from the manager service
     */
    set displayDiagram(value){
        this.workflowManagerService.displayDiagram = value
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
            this.currentWorkflow = undefined;
            if (this.model.isNew) this.removeCurrentWorkflowFromList();

            this.workflowDiagramService.clearDiagram();

        } else {

            this.model.setData(
                this.getCurrentWorkflowData(id)
            );

            this.currentWorkflow = { id, data: this.model.data };

            if (!this.workflowManagerService.hasStartTask()) {
                this.generateStartTask();
            }

            this.workflowDiagramService.reloadDiagram(this.displayDiagram);
        }

    }

    /**
     * call to load the workflow task types
     * set the system modules from metadata
     */
    public ngOnInit() {
        this.loadTypes();
        // load all modules that are workflow relevant
        for(let m in this.metadata.moduleDefs){
            if(this.metadata.moduleDefs[m].workflow) this.modules.push(m);
        }
        this.modules.sort();

        // initialize the current model
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
        data.tasks = [
            ...data.tasks.map(task => this.utils.spiceModel2backend('WorkflowTaskDefinitions', task)),
            ...this.workflowManagerService.deletedTasks.map(task => this.utils.spiceModel2backend('WorkflowTaskDefinitions', {...task, deleted: 1}))
        ];

        this.backend.postRequest(`module/WorkflowDefinitions/${this.currentModule}/${this.currentWorkflowId}`, {}, data).subscribe({
            next: () => {
                this.model.data.isNew = false;
                this.currentWorkflow.data.isNew = false;
                this.workflowManagerService.currentModule.workflowDefinitions.some(d => {
                    if (d.id != this.currentWorkflowId) return false;
                    d.tasks = this.model.data.tasks;
                    return true;
                });
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }

    /**
     * delete workflow and its tasks
     */
    public deleteWorkflow() {

        if (this.model.data.is_active) {
            return;
        }

        this.modal.confirm(this.language.getLabel('MSG_DELETE_RECORD'), this.language.getLabel('LBL_DELETE')).subscribe(answer => {

            if (!answer) return;

            if (this.model.data.isNew) {
                this.removeCurrentWorkflowFromList();
                this.currentWorkflowId = undefined;
                this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_DELETED'), 'success');
                return;
            }

            this.backend.deleteRequest(`module/WorkflowDefinitions/${this.currentWorkflowId}`).subscribe({
                next: (res: { success: boolean, message: string }) => {

                    if (res.success) {
                        this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_DELETED'), 'success');
                        this.removeCurrentWorkflowFromList();
                        this.currentWorkflowId = undefined;
                    } else {
                        this.toast.sendToast(res.message, 'error');
                    }
                },
                error: () => {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
            });
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
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest('module/WorkflowDefinitions/' + this.currentModule).subscribe({
            next: wfd => {
                loadingModal.emit(true);
                this.workflowManagerService.currentModule.workflowDefinitions = wfd;
            }, error: () => {
                loadingModal.emit(true);
            }
        });
    }

    /**
     * get the current workflow data
     * @param id
     * @private
     */
    public getCurrentWorkflowData(id: string): any {
        const data = JSON.parse(JSON.stringify(this.workflowManagerService.currentModule.workflowDefinitions.find(data => data.id == id)));
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
        this.model.data.tasks.push(startTask);
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
            return;
        }

        this.backend.postRequest(`module/WorkflowDefinitions/${this.currentWorkflowId}/setIsActive/${this.model.data.is_active ? 1 : 0}`).subscribe({
            next: () => {
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }

    /**
     * toggle stretch bool
     */
    public toggleStretch() {
        this.stretch = !this.stretch;
    }

    /**
     * save the diagram as svg
     */
    public saveDiagramAsSVG() {
        this.workflowDiagramService.saveAsSVG();
    }
}
