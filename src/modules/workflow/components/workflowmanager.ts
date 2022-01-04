/**
 * @module ModuleWorkflow
 */
import {Component, OnInit} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * @ignore
 */
declare var _;

/**
 * manage workflow and tasks definitions
 */
@Component({
    templateUrl: '../templates/workflowmanager.html',
    providers: [WorkflowManagerService, model]
})
export class WorkflowManager implements OnInit {
    /**
     * holds the system modules
     */
    public modules = [];
    /**
     * holds the current workflow definition
     */
    public currentWorkflow: { id: string, data: any };

    constructor(public backend: backend,
                public metadata: metadata,
                public language: language,
                public utils: modelutilities,
                public modal: modal,
                public toast: toast,
                public configurationService: configurationService,
                public model: model,
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
        this.currentWorkflow = undefined;

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

        if (!id) {

            this.currentWorkflow = undefined;
            if (this.model.isNew) this.removeCurrentWorkflowFromList();

        } else {
            this.currentWorkflow = {
                id,
                data: this.getCurrentWorkflowData(id)
            };
        }
    }

    /**
     * call to load the workflow task types
     * set the system modules from metadata
     */
    public ngOnInit() {
        this.loadTypes();
        this.modules = this.metadata.getModules().sort();
    }

    /**
     * reset selected data
     */
    public cancel() {
        this.currentWorkflowId = undefined;
        this.workflowManagerService.tasks = undefined;
        this.model.cancelEdit();
    }

    /**
     * create new workflow
     */
    public addWorkflow() {

        const newId = this.utils.generateGuid();

        this.workflowManagerService.currentModule.workflowDefinitions.push(
            {
                id: newId,
                isNew: true,
                workflowdefinition_module: this.currentModule,
                workflowdefinition_status: 'active',
                workflowdefinition_precond: 'a',
                tasks: [],
                conditions: []
            }
        );

        this.currentWorkflowId = newId;

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
                this.workflowManagerService.currentModule.workflowDefinitions = this.workflowManagerService.currentModule.workflowDefinitions.map(item => {
                    if (item.id != this.model.id) return item;
                    item = this.model.data;
                    return item;
                });
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
                        this.cancel();
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

    public getModuleFields(module: string): Array<{ name: string, label: string }> {

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
        this.backend.getRequest('module/WorkflowDefinitions/' + this.currentModule).subscribe(wfd => {
            this.workflowManagerService.currentModule.workflowDefinitions = wfd;
        });
    }

    /**
     * get the current workflow data
     * @param id
     * @private
     */
    public getCurrentWorkflowData(id: string): any {
        const data = this.workflowManagerService.currentModule.workflowDefinitions.find(data => data.id == id);
        return this.utils.backendModel2spice('WorkflowDefinitions', {...data});
    }
}
