/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';

/**
 * renders the app launcher icon and the name of the curent active role. If pressed the app launcher dialog is rendered as modal
 */
@Component({
    selector: 'global-app-launcher',
    templateUrl: './src/globalcomponents/templates/globalapplauncher.html',
    host: {
        class: 'slds-context-bar__primary slds-context-bar__item--divider-right'
    }
})
export class GlobalAppLauncher {

    constructor(private metadata: metadata, private modal: modal, private language: language) {

    }

    /**
     * a getter for the name of the active role in the selected language
     */
    get roleName() {
        let role = this.metadata.getActiveRole();
        if (role.label && role.label != '') {
            return this.language.getLabel(role.label);
        } else {
            return this.metadata.getActiveRole().name;
        }
    }

    /**
     * linked to the app launcher button ion the template and will render the app launcher dialog
     */
    private showAppLauncher() {
        this.modal.openModal('GlobalAppLauncherDialog');
    }
}
