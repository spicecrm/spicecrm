import {ChangeDetectionStrategy, Component, ComponentRef, computed, inject, signal} from '@angular/core';
import {DomainField} from "../interfaces/domainmanager.interfaces";
import {domainmanager} from "../services/domainmanager.service";
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {filter, map, tap} from "rxjs/operators";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {switchMap} from "rxjs";

@Component({
    selector: 'domain-validation-usage-modal',
    templateUrl: '../templates/domainvalidationusagemodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DomainValidationUsageModal implements ModalComponentI {
    /**
     * reference to this component
     */
    public self: ComponentRef<this>;
    /**
     * the fields that use this validation
     */
    public usedIn = computed<(DomainField & {_domainName: string})[]>(() => {

        const validationId = this.validationId();

        if (!validationId) return [];

        return this.domainmanager.domainfields()
            .filter(f => f.sysdomainfieldvalidation_id == validationId)
            .map(f => ({...f, _domainName: this.domainmanager.domaindefinitions.find(d => d.id == f.sysdomaindefinition_id)?.name}));
    });
    /**
     * the id of the validation passed from the trigger component
     */
    public validationId = signal<string>(undefined);
    /**
     * reference to the domain manager service
     * @private
     */
    private domainmanager = inject(domainmanager);
    /**
     * reference to the backend service
     * @private
     */
    private backend = inject(backend);
    /**
     * reference to the toast service
     * @private
     */
    private toast = inject(toast);
    /**
     * reference to the modal service
     * @private
     */
    private modal = inject(modal);

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * unlink a field from the validation
     * @param field
     */
    public unlink(field: DomainField & {_domainName: string}) {

        const {_domainName, ...fieldData} = field;
        fieldData.sysdomainfieldvalidation_id = '';

        this.modal.confirm('MSG_CONFIRM_UNLINK_DOMAIN_FIELD', 'LBL_UNLINK').pipe(
            filter(answer => !!answer),
            switchMap(() => this.backend.postRequest(`dictionary/domainfield/${fieldData.id}`, {}, fieldData))
        ).subscribe({
            next: () => {
                this.domainmanager.domainfields.update(arr => {
                    arr.find(f => f.id == field.id).sysdomainfieldvalidation_id = '';
                    return [...arr];
                });
                this.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');
            },
            error: () => this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error')
        });
    }

    public linkDomain() {

    }
}