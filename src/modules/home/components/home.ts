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
    templateUrl: './src/modules/home/templates/home.html',
})
export class Home {
    private hasDashboardSet: boolean = false;
    constructor(private broadcast: broadcast, private navigation: navigation, private metadata: metadata, private userpreferences: userpreferences) {
        this.userpreferences.loadPreferences().subscribe(res => this.hasDashboardSet = res.home_dashboardset && res.home_dashboardset.length > 0);
        // set the navigation paradigm
        this.navigation.setActiveModule('Home');
    }

    get displayHomeAssistant() {
        let hidden = !this.userpreferences.toUse.home_assistant || this.userpreferences.toUse.home_assistant == 'hidden';
        return window.innerWidth > 1024 && !hidden;
    }
}
