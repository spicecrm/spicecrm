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
import {domainmanager} from '../services/domainmanager.service';

@Component({
    templateUrl: './src/workbench/templates/domainmanager.html',
    providers: [metadata, domainmanager]
})
export class DomainManager {

    /**
     * the currently seleted domain element
     */
    private currentDomainDefinition: string;

    /**
     * the urrently selected domain field
     */
    private currentDomainField: string;

    /**
     * the scope for the tabbed view
     */
    private tabScope: 'details' | 'validations' = 'details';

    constructor(private domainmanager: domainmanager, private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast) {
    }

    get domaindefinitions() {
        return this.domainmanager.domaindefinitions
    }

    get domainfields() {
        return this.domainmanager.domainfields
    }

    get currentField() {
        return this.domainfields.find(field => field.id == this.currentDomainField);
    }

}
