import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-app-launcher-dialog',
    templateUrl: './src/globalcomponents/templates/globalapplauncherdialog.html'
})
export class GlobalAppLauncherDialog {

    private searchTerm: string = '';
    public self: any = undefined;

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

    private close() {
        this.self.destroy();
    }

    private getRoleName() {
        return this.metadata.getActiveRole().name;
    }

    private getRoles() {
        return this.metadata.getRoles();
    }

    private setRole(roleid) {
        this.metadata.setActiveRole(roleid);

        // navigate home and broadcast the message
        this.broadcast.broadcastMessage('applauncher.setrole', roleid);

        // close the launcher dialog
        this.close();
    }

    private getModules() {
        let menuItems = [];

        for (let module of this.metadata.getModules()) {
            let moduleData = this.metadata.getModuleDefs(module);
            if (moduleData.visible && this.metadata.checkModuleAcl(module, 'list') && (this.searchTerm === '' || (this.searchTerm !== '' && this.language.getModuleName(module) && this.language.getModuleName(module).toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0))) {
                menuItems.push(module);
            }
        }

        menuItems.sort((a, b) => {
            return this.language.getModuleName(a) > this.language.getModuleName(b) ? 1 : -1;
        });

        return menuItems;
    }

    private gotoModule(module) {
        this.router.navigate(['/module/' + module]);
        this.close();
    }
}