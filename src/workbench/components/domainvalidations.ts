import {Component, ChangeDetectionStrategy, inject, signal, computed, model, Injector} from '@angular/core';
import {domainmanager} from "../services/domainmanager.service";
import {DomainValidation} from "../interfaces/domainmanager.interfaces";
import {modal} from "../../services/modal.service";
import {DomainManagerEditValidation} from "./domainmanagereditvalidation";
import {switchMap} from "rxjs";
import {outputToObservable} from "@angular/core/rxjs-interop";
import {filter, tap} from "rxjs/operators";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {DomainManagerFieldValidation} from "./domainmanagerfieldvalidation";
import {DomainValidationUsageModal} from "./domainvalidationusagemodal";

@Component({
    selector: 'domain-validations',
    templateUrl: '../templates/domainvalidations.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
    providers: [domainmanager]
})
export class DomainValidations {
    /**
     * stores the search term
     */
    public searchterm = model<string>();
    /**
     * stores the scope of the filter
     */
    public filterScope = model<'g'|'c'>(undefined);
    /**
     * stores the filtered validations
     */
    public filteredValidations = computed<DomainValidation[]>(() =>
        this.domainmanager.domainfieldvalidations().filter(v =>
            (!this.filterScope() || this.filterScope() == v.scope) &&
            (!this.searchterm() || v.name.toLowerCase().indexOf(this.searchterm().toLowerCase()) >= 0)
        )
    );
    /**
     * returns the validations in use object
     */
    public validationsInUse = computed<{[key: string]: true}>(() => {

        const validationsInUse = {};

        this.domainmanager.domainfields().forEach(field => {
            if (!field.sysdomainfieldvalidation_id) return;
            validationsInUse[field.sysdomainfieldvalidation_id] = true;
        });

        return validationsInUse;
    });
    /**
     * reference to the domain manager service
     */
    public domainmanager = inject(domainmanager);
    /**
     * reference to the modal service
     */
    private modal = inject(modal);
    /**
     * reference to the injector
     */
    private injector = inject(Injector);
    /**
     * reference to the backend service
     */
    private backend = inject(backend);
    /**
     * reference to the toast service
     */
    private toast = inject(toast);

    /**
     * open the edit modal
     * @param validation
     */
    public openEditModal(validation?: DomainValidation) {
        this.modal.openStaticModal(DomainManagerEditValidation, true, this.injector).pipe(
            tap(modalRef => modalRef.instance.fieldValidation.set(validation)),
            switchMap(modalRef => outputToObservable(modalRef.instance.validationId))
        ).subscribe();
    }

    /**
     * add a new validation
     */
    public addValidation() {
        this.openEditModal();
    }

    /**
     * delete the validation
     * @param id
     */
    public deleteValidation(id: string) {

        this.modal.confirmDeleteRecord().pipe(
            filter(answer => !!answer),
            switchMap(() => this.backend.deleteRequest(`dictionary/domainvalidation/${id}`, null))
        ).subscribe({
            next: () => {
                this.domainmanager.domainfieldvalidations.update(arr => arr.filter(v => v.id != id))
                this.toast.sendToast('MSG_SUCCESSFULLY_DELETED', 'success');
            },
            error: err => {
                if (err.error.error.code) {
                    this.toast.sendError('ERR_FAILED_TO_EXECUTE');
                } else {
                    this.toast.sendError('ERR_FAILED_TO_EXECUTE');
                }
            }
        })
    }

    /**
     * open the validation options modal
     * @param id
     */
    public openValidationOptions(id: string) {
        this.modal.openStaticModal(DomainManagerFieldValidation, true, this.injector).subscribe(modalRef => {
            modalRef.instance.validationId = id;
        });
    }

    /**
     * show the validations in use modal
     * @param id
     */
    public showUsedIn(id: string) {
        this.modal.openStaticModal(DomainValidationUsageModal, true, this.injector).subscribe(modalRef => {
            modalRef.instance.validationId.set(id);
        })
    }
}