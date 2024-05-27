import {Component, ComponentRef, OnDestroy} from '@angular/core';
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {Subject} from "rxjs";

@Component({
    selector: 'dictionary-manager-fix-db-fields-mismatch-modal',
    templateUrl: '../templates/dictionarymanagerfixdbfieldsmismatchmodal.html'
})

export class DictionaryManagerFixDBFieldsMismatchModal implements ModalComponentI, OnDestroy {
    /**
     * reference of the component
     */
    public self: ComponentRef<DictionaryManagerFixDBFieldsMismatchModal>;
    /**
     * dictionary id
     */
    public dictionaryName: string;
    /**
     * dictionary definitions
     */
    public dictionaries: string[] = [];
    /**
     * dictionary id
     */
    public response = new Subject<boolean>();

    public mismatch: {
        [dictionaryName: string]: {
            requiredColumnsWithNullRows: {
                name: string, count: number, dbDefinition: {len: number}, status: 'processing' | 'error' | 'executed'
            }[],
            columnsWithTruncateRows: {
                name: string, length: number, count: number, status: 'processing' | 'error' | 'executed', dbDefinition: {len: number}
            }[]
        }
    } = {};
    /**
     * mismatch columns
     */
    public values: {[key: string]: string} = {};

    constructor(private backend: backend,
                private modal: modal,
                private toast: toast) {
    }

    public ngOnDestroy() {
        this.emitResponse();
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * emit the response
     * @private
     */
    private emitResponse() {
        this.response.next(
            Object.keys(this.mismatch).some(dic =>
                ['columnsWithTruncateRows', 'requiredColumnsWithNullRows'].some(arr => this.mismatch[dic][arr].some(c => c.status == 'executed'))
            )
        );
        this.response.complete();
    }

    /**
     * set the columns values
     */
    public execute(field, type: 'length' | 'notnull') {

        const body: any = {column: field.name};

        if (type == 'notnull') body.value = this.values[field.name];

        field.status = 'processing';

        this.backend.putRequest(`dictionary/dbcolumn/mismatch/${type}/${this.dictionaryName}`, null, body).subscribe({
            next: () => {
                field.status = 'executed';
                this.toast.sendToast('success', 'success');
                },
            error: err => {
                field.status = 'error';
                this.toast.sendToast('LBL_ERROR', "error", err.error.error.message);
            }
        });
    }

    /**
     * delete null rows for column
     * @param field
     */
    public deleteNullRows(field) {

        this.backend.deleteRequest(`dictionary/dbcolumn/${field.name}/mismatch/notnull/${this.dictionaryName}`).subscribe({
            next: () => {
                field.status = 'executed';
                this.toast.sendToast('success', 'success');
            },
            error: err => {
                field.status = 'error';
                this.toast.sendToast('LBL_ERROR', "error", err.error.error.message);
            }
        });
    }

    /**
     * set selected dictionary and get its data
     * @param dic
     */
    public setSelectedDictionary(dic: string) {
        this.dictionaryName = dic;
    }
}