/**
 * @module GlobalComponents
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {userpreferences} from "../../services/userpreferences.service";

/**
 * the app launcher dialog that renders the users roles and also the users modules. Allows filering and navigating to a specific module/application
 */
@Component({
    selector: 'global-app-launcher-dialog',
    templateUrl: '../templates/globalapplauncherdialog.html'
})
export class GlobalAppLauncherDialog {

    /**
     * @ignore
     */
   public searchTerm: string = '';
    /**
     * @ignore
     */
    public self: any = undefined;

    constructor(
       public metadata: metadata,
       public language: language,
       public router: Router,
       public broadcast: broadcast,
       public userpreferences: userpreferences
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
   public close() {
        this.self.destroy();
    }


    /**
     * fecthes the available roles for the user
     */
   public getRoles() {
        return this.metadata.getRoles();
    }

    /**
     * set the chosen role and closes the app launcher
     *
     * @param roleid the selected roleid
     */
   public setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // set the role to the preferences
        this.userpreferences.setPreference('userrole', roleid)

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.close();
    }

    /**
     * gets the modules from the metadata service and returns them for rendering in the modal
     */
   public getModules() {
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
   public gotoModule(module) {
        this.router.navigate(['/module/' + module]);
        this.close();
    }
}
