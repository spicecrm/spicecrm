/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {domainmanager} from '../services/domainmanager.service';
import {EMPTY, Observable, of, switchMap} from "rxjs";
import {outputToObservable} from "@angular/core/rxjs-interop";
import {filter, map, tap} from "rxjs/operators";
import {DomainField} from "../interfaces/domainmanager.interfaces";
import {DomainManagerEditValidation} from "./domainmanagereditvalidation";
import {DomainManagerFieldValidation} from "./domainmanagerfieldvalidation";

/**
 * a table with the field in a domain. Enables also drag and drop to sequence and adding as well as removing fields
 */
@Component({
    selector: 'domain-manager-fields',
    templateUrl: '../templates/domainmanagerfields.html',
    standalone: false
})
export class DomainManagerFields {
    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public broadcast: broadcast, public toast: toast, public modal: modal, public injector: Injector) {

    }

    get domainfields() {
        let domainfields = this.domainmanager.domainfields().filter(f => f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition && f.scope == 'c');
        for (let domainfield of this.domainmanager.domainfields().filter(f => f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition && f.scope != 'c')) {
            if (domainfields.findIndex(d => d.name == domainfield.name) == -1) {
                domainfields.push(domainfield);
            }
        }
        return domainfields.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    /**
     * handles the drop event and resets the sequence fiels
     * @param event
     */
    public drop(event) {
        // get the values and reshuffle
        let values = this.domainfields;
        let previousItem = values.splice(event.previousIndex, 1);
        values.splice(event.currentIndex, 0, previousItem[0]);

        let savingModal = this.modal.await('LBL_SAVING');
        this.backend.postRequest('dictionary/domainfields/sequence', {}, {fields: values.map(v => v.id)}).subscribe({
            next: () => {
                // reindex the array resetting the sequence
                let i = 0;
                for (let item of values) {
                    item.sequence = i;
                    i++;
                }
                savingModal.emit(true);
            },
            error: () => {
                savingModal.emit(true);
            }
        })

    }

    /**
     * react to the click to add a new domain field
     */
    public addDomainField() {
        this.modal.openModal('DomainManagerAddFieldModal', true, this.injector);
    }

    /**
     * shows the details for the field
     *
     * @param event
     * @param id
     */
    public showDetails(domainfield) {
        this.modal.openModal('DomainManagerFieldDetails', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.field = domainfield;
            }
        })
    }

    public validationName(validationId) {
        return validationId ? this.domainmanager.getValidationById(validationId)?.name : ''
    }

    public unlinkValidation(domainfield) {
        this.modal.prompt('confirm', 'MSG_UNLINK_VALIDATION', 'MSG_UNLINK_VALIDATION').subscribe({
            next: (resp) => {
                if (resp) {
                    domainfield.sysdomainfieldvalidation_id = '';
                    this.updateDomainField(domainfield).subscribe();
                }
            }
        });
    }

    /**
     * shows the validation for the field
     * @param domainField
     */
    public showValidation(domainField: DomainField) {
        if (!domainField.sysdomainfieldvalidation_id) {
            this.modal.openModal('DomainManagerSelectValidation', true, this.injector).pipe(
                switchMap(modalRef => outputToObservable<string>(modalRef.instance.validationId)),
                switchMap(id => this.handleSelectValidation(id, domainField)),
                tap(validation => domainField.sysdomainfieldvalidation_id = validation.id),
                switchMap(validation => this.updateDomainField(domainField).pipe(map(() => validation))),
                switchMap(validation => this.openFieldValidation(domainField, validation.action))
            ).subscribe({
                error: () => this.toast.sendError('ERR_FAILED_TO_EXECUTE'),
            });
        } else {
            this.openFieldValidation(domainField).subscribe();
        }
    }

    /**
     * handles the select validation event
     * @param selectedValidationId
     * @param domainField
     * @private
     */
    private handleSelectValidation(selectedValidationId: string, domainField: DomainField): Observable<{action: 'new' | 'edit', id: string}> {
        if (selectedValidationId == 'new') {
            return this.modal.openStaticModal(DomainManagerEditValidation, true, this.injector).pipe(
                tap(modalRef => modalRef.instance.domainField.set( domainField)),
                switchMap(modalRef => outputToObservable<string>(modalRef.instance.validationId)),
                map(id => ({id, action: 'new'}))
            )
        } else {
            return of({id: selectedValidationId, action: 'edit'});
        }
    }

    /**
     * opens the validation modal
     * @param domainField
     * @param action
     * @private
     */
    private openFieldValidation(domainField: DomainField, action: 'new' | 'edit' = 'new') {
        if (action != 'new') {
            return EMPTY;
        }

        return this.modal.openStaticModal(DomainManagerFieldValidation, true, this.injector).pipe(
            tap((modalRef) =>
                modalRef.instance.validationId = domainField.sysdomainfieldvalidation_id
            )
        );
    }

    /**
     * prompts the user and delets the domain field
     *
     * @param event
     * @param id
     */
    public deleteDomainField(id: string) {
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.backend.deleteRequest(`dictionary/domainfield/${id}`).subscribe({
                    next: (res) => {
                        this.domainmanager.domainfields.update(arr => arr.filter(f => f.id != id));
                        if (this.domainmanager.currentDomainField == id) {
                            this.domainmanager.currentDomainField = null;
                        }
                    }
                })
            }
        });
    }

    /**
     * customize the validation value
     *
     * @param e
     * @param validationValue
     */
    public customizeDomainField(e: MouseEvent, domainField) {
        e.stopPropagation();
        if (domainField.scope == 'g') {
            this.modal.prompt('confirm', 'Customize the Field?', 'Customize').subscribe(resp => {
                if (resp) {
                    let newValue = {...domainField};
                    newValue.id = this.modelutilities.generateGuid();
                    newValue.scope = 'c';
                    this.domainmanager.domainfields.update(arr => [...arr, newValue]);
                    this.domainmanager.currentDomainField = newValue.id;
                    this.domainmanager.currentDomainScope = newValue.scope;
                }
            });
        }
    }

    /**
     * toggle the status
     * @param e
     * @param validationValue
     */
    public setStatus(domainfield, status) {
        let loadingModal;
        switch (status) {
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/domainfield/${domainfield.id}/activate`).subscribe({
                    next: () => {
                        domainfield.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            case 'i':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.deleteRequest(`dictionary/domainfield/${domainfield.id}/activate`).subscribe({
                    next: () => {
                        domainfield.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                domainfield.status = status;
        }
    }

    /**
     * updates the domain field
     *
     * @param domainfield
     * @private
     */
    private updateDomainField(domainfield) {
        return this.backend.postRequest(`dictionary/domainfield/${domainfield.id}`, {}, domainfield).pipe(
            tap({
                next: () => this.toast.sendToast('LBL_SAVED', 'success')
            })
        );
    }

    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * repair domain field related dictionary items
     */
    public repairRelatedDictionaryItems() {
        this.modal.confirm('MSG_REPAIR_DOMAIN_DEFINITION_DICTIONARY_RELATED', 'MSG_REPAIR_DOMAIN_DEFINITION_DICTIONARY_RELATED').subscribe(answer => {

            if (!answer) return;

            this.backend.postRequest(`dictionary/domaindefinition/${this.domainmanager.currentDomainDefinition}/repairrelated`).subscribe({
                next: () => {
                    this.toast.sendToast('LBL_DICTIONARY_REPAIRED', 'success');
                }
            });

        });
    }
}
