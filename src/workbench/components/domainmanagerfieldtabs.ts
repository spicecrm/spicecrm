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
    templateUrl: '../templates/domainmanagerfieldtabs.html'
})
export class DomainManagerFieldTabs {

    /**
     * the scope for the tabbed view
     */
    public tabScope: 'details' | 'validations' = 'details';

    constructor(public domainmanager: domainmanager, public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities, public broadcast: broadcast, public toast: toast, public modal: modal, public injector: Injector) {

    }

    get domainfields() {
        return this.domainmanager.domainfields;
    }

    get currentField() {
        return this.domainfields.find(field => field.id == this.domainmanager.currentDomainField);
    }

}
