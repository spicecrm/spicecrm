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
 * a component allowing the management of the domaisn in the dictionary defined in the system
 */
@Component({
    selector: 'domain-manager-field-tabs',
    templateUrl: './src/workbench/templates/domainmanagerfieldtabs.html'
})
export class DomainManagerFieldTabs {

    /**
     * the scope for the tabbed view
     */
    private tabScope: 'details' | 'validations' = 'details';

    constructor(private domainmanager: domainmanager, private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast, private modal: modal, private injector: Injector) {

    }

    get domainfields() {
        return this.domainmanager.domainfields;
    }

    get currentField() {
        return this.domainfields.find(field => field.id == this.domainmanager.currentDomainField);
    }

}
