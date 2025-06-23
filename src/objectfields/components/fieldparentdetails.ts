/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

@Component({
    templateUrl: '../templates/fieldparentdetails.html',
    standalone: false
})
export class fieldParentDetails extends fieldGeneric implements OnInit {

    public parentDefs: any = {};

    public ngOnInit() {
        super.ngOnInit();
        this.getParentDefinition();
    }

    /**
     * Parent ID getter.
     */
    get parentId() {
        return this.model.getField(this.fieldconfig.parent_id_field ?? this.parentDefs?.id_name ?? 'parent_id');
    }

    /**
     * Initializes parent object definitions.
     * @private
     */
    public getParentDefinition() {
        this.parentDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
    }

}
