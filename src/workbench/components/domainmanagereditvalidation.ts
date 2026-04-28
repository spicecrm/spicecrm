/**
 * @module WorkbenchModule
 */
import {Component, ComponentRef, inject, OnInit, output, signal} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {domainmanager} from '../services/domainmanager.service';
import {DomainField, DomainValidation} from "../interfaces/domainmanager.interfaces";
import {toast} from "../../services/toast.service";

/**
 * a modal window to add a new validation to a domain field
 */
@Component({
    selector: 'domain-manager-edit-validation',
    templateUrl: '../templates/domainmanagereditvalidation.html',
    standalone: false
})
export class DomainManagerEditValidation implements OnInit {
    /**
     * reference to the modal itself
     */
    public self: ComponentRef<this>;
    /**
     *  an empty validation record
     */
    public fieldValidation = signal<DomainValidation>(undefined);
    /**
     * stores the domain field definition
     */
    public domainField = signal<DomainField>(undefined);
    /**
     * output to emit the validation id
     */
    public validationId = output<string>();
    /**
     * reference to the domain manager service
     */
    public domainmanager = inject(domainmanager);
    /**
     * reference to the backend service
     */
    public backend = inject(backend);
    /**
     * reference to the model utilities service
     */
    public modelutilities = inject(modelutilities);
    /**
     * reference to the toast service
     */
    public toast = inject(toast);

    public ngOnInit() {
        this.initializeValidation();
    }

    /**
     * adds the validation, selects it and closes the modal
     */
    public save() {
        this.backend.postRequest(`dictionary/domainvalidation/${this.fieldValidation().id}`, {}, this.fieldValidation()).subscribe({
            next: () => {
                if (!this.domainmanager.domainfieldvalidations().some(v => v.id == this.fieldValidation().id)) {
                    this.domainmanager.domainfieldvalidations.set([...this.domainmanager.domainfieldvalidations(), this.fieldValidation()]);
                }
                this.validationId.emit(this.fieldValidation().id);
                this.close();
            },
            error: () => this.toast.sendError('ERR_FAILED_TO_EXECUTE')
        });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * initializes the validation record
     * @private
     */
    private initializeValidation() {

        if (this.fieldValidation()) return;

        this.fieldValidation.set({
            name: "",
            order_by: 'sequence',
            sort_flag: undefined,
            status: 'a',
            validation_type: "enum",
            scope: 'c',
            id: this.modelutilities.generateGuid(),
            version: this.domainmanager.getCurrentReleaseVersion(),
            package: this.domainField()?.package
        });
    }
}
