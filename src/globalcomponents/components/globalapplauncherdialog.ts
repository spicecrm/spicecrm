import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-app-launcher-dialog',
    templateUrl: './app/globalcomponents/templates/globalapplauncherdialog.html',
    host: {
        'class': 'slds-context-bar__primary slds-context-bar__item--divider-right'
    }
})
export class GlobalAppLauncherDialog {

    searchTerm: string = '';
    self: any = undefined;
    toggleShowRoles: boolean = true;
    toggleShowModules: boolean = true;

    constructor(
        private metadata: metadata,
        private language: language,
        private router: Router,
        private broadcast: broadcast
    ) {

    }

    get showRoles() {
        return this.metadata.getRoles().length > 1;
    }

    toggleShow(section) {
        switch (section){
            case 'roles':
                this.toggleShowRoles = !this.toggleShowRoles;
                break;
            case 'modules':
                this.toggleShowModules = !this.toggleShowModules;
                break;
        }
    }

    hideAppLauncher() {
        this.self.destroy();
    }

    getRoleName() {
        return this.metadata.getActiveRole().name;
    }

    getRoleLabel(roleid, label) {
        let roles = this.getRoles();
        let role = undefined;
        roles.some(thisrole => {
            if (thisrole.id == roleid) {
                role = thisrole;
                return true;
            }
        });

        if (role.label && role.label != '') {
            switch (label) {
                case 'identifier':
                    return this.language.getAppLanglabel(role.label, 'short');
                case 'name':
                    return this.language.getAppLanglabel(role.label);
                case 'description':
                    return this.language.getAppLanglabel(role.label, 'long');
            }
        } else {
            return role[label];
        }
    }

    getRoles() {
        return this.metadata.getRoles();
    }

    setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        // this.router.navigate(['/module/Home']);
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.hideAppLauncher();
    }

    getModules() {
        let menuItems = [];

        for (let module of this.metadata.getModules()) {
            let moduleData = this.metadata.getModuleDefs(module);
            if (moduleData.visible && this.metadata.checkModuleAcl(module, 'list') && (this.searchTerm === '' || (this.searchTerm !== '' && this.language.getModuleName(module) && this.language.getModuleName(module).toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0)))
                menuItems.push(module);
        }

        menuItems.sort((a, b) => {
            return this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1;
        });

        return menuItems;
    }

    gotoModule(module) {
        this.hideAppLauncher();
        this.router.navigate(['/module/' + module]);
    }
}