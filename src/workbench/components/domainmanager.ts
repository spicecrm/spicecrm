/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/workbench/templates/domainmanager.html',
    providers: [metadata]
})
export class DomainManager {

    currentDomain: string = "";
    domains: Array<any> = [];
    currentField: string = '';

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast) {

        this.backend.getRequest('dictionary/domains').subscribe(domains => {
            this.domains = domains;
        });

    }

    reset() {
        this.currentField = '';
    }

    selectItem(id) {
        this.currentField = id;
    }

    isSelected(id) {
        return this.currentField === id;
    }

    getDomainFields() {
        let domainFields = [];
        this.domains.some(domain => {
            if (domain.id == this.currentDomain) {
                domainFields = domain.technicalFields;
                return true;
            }
        });
        return domainFields;
    }

    showDetails() {
        return this.currentDomain && this.currentField;
    }

    getCurrentField() {
        let field = {};
        this.domains.some(domain => {
            if (domain.id == this.currentDomain) {
                domain.technicalFields.some(tfield => {
                    if (tfield.id === this.currentField) {
                        field = tfield;
                        return true;
                    }
                })
                return true;
            }
        });
        return field;
    }
}