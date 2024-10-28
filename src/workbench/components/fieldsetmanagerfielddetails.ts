/**
 * @module WorkbenchModule
 */
import {Component, Input, OnChanges} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {view} from '../../services/view.service';


@Component({
    selector: 'fieldsetmanager-field-details',
    templateUrl: '../templates/fieldsetmanagerfielddetails.html',
    providers: [view]
})
export class FieldsetManagerFieldDetails implements OnChanges {

    @Input() public field: any = {};
    @Input() public module: string;
    public currentField: any = {};
    public fieldtypes: string[] = [];

    public component: string = "";
    public configValues: any = {};


    constructor(public metadata: metadata, public view: view) {
        this.fieldtypes = this.metadata.getFieldTypes();
        this.fieldtypes.sort();
        this.fieldtypes.unshift('');
    }

    public ngOnChanges() {

        if (this.field.isViewMode) {
            this.view.setViewMode();
        } else {
            this.view.setEditMode();
        }

        this.currentField = this.field.data;
        this.component = this.metadata.getFieldTypeComponent(this.field.data.fieldconfig.fieldtype);
        this.configValues = this.field.data.fieldconfig;
    }

    public selectFieldType(fieldType) {
        // set the fieldtype
        this.configValues.fieldtype = fieldType?.id;
        Object.keys(this.configValues).forEach(k => {
            if (k == 'fieldtype') return;
            delete this.configValues[k];
        });
        this.component = this.metadata.getFieldTypeComponent(this.configValues.fieldtype);
    }

    /**
     * sets the version for the fieldsetitem
     * @param version
     */
    public setVersion(version: {name: string;}) {
        this.currentField.version = version?.name;
    }

    /**
     * sets the package for the fieldsetitem
     * @param packageData
     */
    public setPackage(packageData: {name: string;}) {
        this.currentField.package = packageData?.name;
    }
}
