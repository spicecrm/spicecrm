/**
 * @module ModuleHome
 */
import {
    Component
} from '@angular/core';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {metadata} from '../../../services/metadata.service';
import {userpreferences} from "../../../services/userpreferences.service";

@Component({
    templateUrl: '../templates/home.html',
})
export class Home {
    public hasDashboardSet: boolean = false;
    constructor(public broadcast: broadcast, public navigation: navigation, public metadata: metadata, public userpreferences: userpreferences) {
        this.userpreferences.loadPreferences().subscribe(res => this.hasDashboardSet = res.home_dashboardset && res.home_dashboardset.length > 0);
        // fallback to value set in active role
        if(!this.hasDashboardSet){
            let activeRole = this.metadata.getActiveRole();
            if(activeRole && activeRole.default_dashboardset && activeRole.default_dashboardset){
                this.hasDashboardSet = true;
            }
        }
        // set the navigation paradigm
        this.navigation.setActiveModule('Home');
    }

    get displayHomeAssistant() {
        let hidden = !this.userpreferences.toUse.home_assistant || this.userpreferences.toUse.home_assistant == 'hidden';
        return window.innerWidth > 1024 && !hidden;
    }
}
