import {Component, OnDestroy, OnInit, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {WorkflowManagerService} from "../services/workflowmanager.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'workflow-manager-task-types-generate-bean',
    templateUrl: '../templates/workflowmanagertasktypesgeneratebean.html',
    providers: [view]
})

export class WorkflowManagerTaskTypesGenerateBean implements OnInit, OnDestroy {
    /**
     * count the pushed required fields to the mapping array to manage the add action disable
     */
    public requiredAdded: number = 0;
    /**
     * map object holds the required fields
     */
    public requiredFields: Map<string, string> = new Map();
    /**
     * holds the added to fields
     */
    public addedToFields: string[] = [];
    /**
     * holds the added from fields
     */
    public addedFromFields: string[] = [];
    /**
     * holds the rxjs subscriptions
     * @private
     */
    private subscriptions = new Subscription();

    constructor(@SkipSelf() public model: model,
                public workflowManager: WorkflowManagerService,
                private view: view,
                private metadata: metadata) {
    }

    /**
     * @return [] mapping fields
     */
    get mappingFields(): { fromField: string, toField: string, isFixed?: boolean, fixedValue?: any }[] {
        return this.model.data.type_config.mappingFields;
    }

    /**
     * set mapping fields
     * @param val
     */
    set mappingFields(val: { fromField: string, toField: string, isFixed?: boolean, fixedValue?: any }[]) {
        this.model.data.type_config.mappingFields = val;
    }

    /**
     * initialize the mapping fields
     */
    public ngOnInit() {
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();

        if (!!this.model.data.type_config.module) {
            this.loadRequiredFields();
        }

        if (!this.mappingFields) {
            this.mappingFields = [];
        } else {
            this.onFromFieldChange();
            this.onToFieldChange();
        }
    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * add new mapping field
     */
    public add() {
        this.mappingFields.push({
            fromField: '',
            toField: ''
        });
    }

    /**
     * remove a mapping field
     * @param index
     */
    public remove(index: number) {
        if (this.isRequired(this.mappingFields[index].toField)) {
            this.requiredAdded--;
        }
        this.mappingFields.splice(index, 1);
    }

    /**
     * toggle is fixed value to display a field container or a mapping field selector
     * @param index
     */
    public switchFixed(index: number) {
        this.mappingFields[index].isFixed = !this.mappingFields[index].isFixed;
    }

    /**
     * add required fields immediately after selecting the target module
     */
    public addRequiredFields() {

        this.requiredFields.forEach(field => {

            const requiredExists = this.mappingFields.some(existing => existing.toField == field);

            if (requiredExists) return;
            this.mappingFields.push({toField: field, fromField: ''});

            this.addedToFields = this.mappingFields.map(f => f.toField);

            this.requiredAdded++;
        });
    }

    /**
     * add required fields
     */
    public onModuleChange() {
        this.mappingFields = [];
        this.loadRequiredFields();

    }

    /**
     * adjust requiredAdded count on to field change
     */
    public onToFieldChange() {
        this.requiredAdded = this.mappingFields.filter(f => this.requiredFields.has(f.toField)).length;
        this.addedToFields = this.mappingFields.map(f => f.toField);
    }

    /**
     * adjust requiredAdded count on to field change
     */
    public onFromFieldChange() {
        this.addedFromFields = this.mappingFields.map(f => f.fromField);
    }

    /**
     * load required fields
     * @private
     */
    private loadRequiredFields() {
        this.requiredFields = new Map();
        const toModuleFields = this.metadata.getModuleFields(this.model.data.type_config.module);
        this.requiredFields = new Map(Object.keys(toModuleFields)
            .filter(f => toModuleFields[f].required && toModuleFields[f].name != 'id')
            .map(f => [toModuleFields[f].name, toModuleFields[f].name]));
    }

    /**
     * check if field is required
     * @param field
     * @private
     */
    private isRequired(field: string): boolean {
        return this.requiredFields.has(field);
    }

    /**
     * set from field fixed value from the field container provided model data
     * @param data
     * @param fieldObj
     */
    public setFromFieldFixedValue(data: any, fieldObj: { fromField: string, toField: string, isFixed?: boolean, fixedValue?: any }) {
        fieldObj.fixedValue = data[fieldObj.toField];
    }

    /**
     * generate fixed field model data object
     * @param fieldObj
     */
    public generateFixedFieldModelData(fieldObj: { fromField: string, toField: string, isFixed?: boolean, fixedValue?: any }) {
        return {[fieldObj.toField]: fieldObj.fixedValue};
    }

    /**
     * return number index of the field to cache the view of the field
     * @param i
     */
    public trackByFn(i: number): number {
        return i;
    }
}