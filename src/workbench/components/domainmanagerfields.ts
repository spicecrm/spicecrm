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

/**
 * a table with the field in a domain. Enables also drag and drop to sequence and adding as well as removing fields
 */
@Component({
    selector: 'domain-manager-fields',
    templateUrl: './src/workbench/templates/domainmanagerfields.html',
})
export class DomainManagerFields {


    constructor(private domainmanager: domainmanager, private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast, private modal: modal, private injector: Injector) {

    }

    get domainfields() {
        let domainfields = this.domainmanager.domainfields.filter(f => f.deleted == 0 && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition && f.scope == 'c');
        for (let domainfield of this.domainmanager.domainfields.filter(f => f.deleted == 0 && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition && f.scope != 'c')) {
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
    private drop(event) {
        // get the values and reshuffle
        let values = this.domainfields;
        let previousItem = values.splice(event.previousIndex, 1);
        values.splice(event.currentIndex, 0, previousItem[0]);

        // reindex the array resetting the sequence
        let i = 0;
        for (let item of values) {
            item.sequence = i;
            i++;
        }
    }


    /**
     * react to the click to add a new domain field
     */
    private addDomainField(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DomainManagerAddFieldModal', true, this.injector);
    }

    /**
     * prompts the user and delets the domain field
     *
     * @param event
     * @param id
     */
    private deleteDomainField(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.domainmanager.domainfields.find(f => f.id == id).deleted = 1;
                if (this.domainmanager.currentDomainField == id) {
                    this.domainmanager.currentDomainField == null;
                }
            }
        });
    }

    /**
     * customize the validation value
     *
     * @param e
     * @param validationValue
     */
    private customizeDomainField(e: MouseEvent, domainField) {
        e.stopPropagation();
        if (domainField.scope == 'g') {
            this.modal.prompt('confirm', 'Customize the Field?', 'Customize').subscribe(resp => {
                if (resp) {
                    let newValue = {...domainField};
                    newValue.id = this.modelutilities.generateGuid();
                    newValue.scope = 'c';
                    this.domainmanager.domainfields.push(newValue);
                    this.domainmanager.currentDomainField = newValue.id;
                }
            });
        }
    }

    /**
     * toggle the status
     * @param e
     * @param validationValue
     */
    private setStatus(e: MouseEvent, validationValue) {
        e.stopPropagation();
        if (validationValue.status == 'd') {
            validationValue.status = 'a';
        } else if (validationValue.status == 'a') {
            validationValue.status = 'i';
        } else {
            validationValue.status = 'a';
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

}
