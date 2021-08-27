/**
 * @module GlobalComponents
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

/**
 * the app launcher dialog that renders the users roles and also the users modules. Allows filering and navigating to a specific module/application
 */
@Component({
    selector: 'global-app-launcher-dialog',
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialog.html'
})
export class GlobalAppLauncherDialog {

    /**
     * @ignore
     */
    private searchTerm: string = '';
    /**
     * @ignore
     */
    public self: any = undefined;

    constructor(
        private metadata: metadata,
        private language: language,
        private router: Router,
        private broadcast: broadcast
    ) {
    }

    /**
     * a gett that returns true if the user can choose roles
     */
    get showRoles() {
        return this.metadata.getRoles().length > 1;
    }

    /**
     * closes the modal window and destroys the component
     */
    private close() {
        this.self.destroy();
    }


    /**
     * fecthes the available roles for the user
     */
    private getRoles() {
        return this.metadata.getRoles();
    }

    /**
     * set the chosen role and closes the app launcher
     *
     * @param roleid the selected roleid
     */
    private setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.close();
    }

    /**
     * gets the modules from the metadata service and returns them for rendering in the modal
     */
    private getModules() {
        let menuItems = [];

        for (let module of this.metadata.getModules()) {
            let moduleData = this.metadata.getModuleDefs(module);
            if (moduleData.visible && (!moduleData.visibleaclaction || (moduleData.visibleaclaction && this.metadata.checkModuleAcl(module, moduleData.visibleaclaction))) && this.metadata.checkModuleAcl(module, 'list') && (this.searchTerm === '' || (this.searchTerm !== '' && this.language.getModuleName(module) && this.language.getModuleName(module).toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0))) {
                menuItems.push(module);
            }
        }

        menuItems.sort((a, b) => {
            return this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1;
        });
        return menuItems;
    }

    /**
     * navigates to the slected module and closes the app launcher dialog
     *
     * @param module the module to navigate to
     */
    private gotoModule(module) {
        this.router.navigate(['/module/' + module]);
        this.close();
    }
}
