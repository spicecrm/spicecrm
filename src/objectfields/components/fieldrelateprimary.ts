/**
 * @module ObjectFields
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {popup} from '../../services/popup.service';
import {fieldRelate} from "./fieldrelate";

@Component({
    selector: 'field-relate-primary',
    templateUrl: '../templates/fieldrelate.html',
    providers: [popup],
    standalone: false
})
export class fieldRelatePrimary extends fieldRelate implements OnInit, OnDestroy {

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname + '_link');
        this.relateIdField = this.fieldname + '_id';
        this.relateNameField = this.fieldname + '_name';
        this.relateType = fieldDefs.module;
        this.isAuthorized = this.metadata.checkModuleAcl(this.relateType, 'list') || this.metadata.checkModuleAcl(this.relateType, 'listrelated');
        this.handleRelateFIlterField();
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.relateNameField);
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.relateNameField, val);
    }

}
