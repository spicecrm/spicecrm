/**
 * @module GlobalComponents
 */
import {
    Component, HostListener, Input
} from '@angular/core';
import {Router} from "@angular/router";
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {userpreferences} from "../../services/userpreferences.service";

/**
 * renders the app launcher icon and the name of the curent active role. If pressed the app launcher dialog is rendered as modal
 */
@Component({
    selector: 'global-app-launcher',
    templateUrl: '../templates/globalapplauncher.html',
    host: {
        class: 'slds-context-bar__primary slds-context-bar__item--divider-right'
    }
})
export class GlobalAppLauncher {

    /**
     * add a control-space listener to open the quick launcher
     * @param event
     */
    @HostListener('document:keydown.control.space')quickLaunch(event: KeyboardEvent) {
        this.showAppLauncher();
    }

    constructor(public metadata: metadata,
                public modal: modal,
                public language: language,
                public userPreferences: userpreferences,
                public router: Router) {

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
   public showAppLauncher() {
        this.modal.openModal('GlobalAppLauncherDialog');
    }

   public navigateHome(){
        this.router.navigate(['module/Home']);
    }
}
