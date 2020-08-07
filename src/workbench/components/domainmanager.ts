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


    /**
     * the loaded list of domains
     */
    private domaindefinitions: any[] = [];

    /**
     * the loaded domain fields
     */
    private domainfields: any[] = [];

    /**
     * the currently seleted domain element
     */
    private currentDomainDefinition: string;

    /**
     * the urrently selected domain field
     */
    private currentDomainField: string;

    private tabScope: 'details'|'validations' = 'details';

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast) {
        this.loadDomains();
    }

    /**
     * load the domains
     */
    private loadDomains(){
        this.backend.getRequest('system/dictionary/domains').subscribe(res => {
            this.domaindefinitions = res.domaindefinitions;
            this.domainfields = res.domainfields;
        });
    }

    get currentField() {
        return this.domainfields.find(field => field.id == this.currentDomainField);
    }

}
