/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, OnInit, Output
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {domainmanager} from '../services/domainmanager.service';
import {DomainValidation, DomainValidationValue} from "../interfaces/domainmanager.interfaces";

/**
 * a modal window to add a new validation to a domain field
 */
@Component({
    selector: 'domain-manager-add-validationvalue-modal',
    templateUrl: '../templates/domainmanageraddvalidationvaluemodal.html'
})
export class DomainManagerAddValidationValueModal implements OnInit{

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * the validation this belongs to
     */
    public fieldvalidation: DomainValidation;

    /**
     * the values we currently have
     */
    public fieldvalidationvalues: DomainValidationValue[];

    /**
     *  an empty validation record
     */
    public fieldvalidationvalue: DomainValidationValue;

    @Output() validationValue: EventEmitter<DomainValidationValue> = new EventEmitter<DomainValidationValue>();

    constructor(public domainmanager: domainmanager, public modelutilities: modelutilities) {

    }

    public ngOnInit() {
        this.fieldvalidationvalue = {
            id:this.modelutilities.generateGuid(),
            scope: this.fieldvalidation.scope,
            sysdomainfieldvalidation_id: this.fieldvalidation.id,
            sequence: this.fieldvalidationvalues.length,
            status: 'd',
            valuetype: 'string',
            enumvalue: undefined
        }
    }

    get isDuplicate(){
        return !!this.fieldvalidationvalues.find(v => v.enumvalue == this.fieldvalidationvalue.enumvalue);
    }

    /**
     * adds the validation, selects it and closes the modal
     */
    public add() {
        this.validationValue.emit(this.fieldvalidationvalue)
        this.close();
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
