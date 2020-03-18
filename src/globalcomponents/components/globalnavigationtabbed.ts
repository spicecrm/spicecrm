/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation, objectTab} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-tabbed',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbed.html',
})
export class GlobalNavigationTabbed {

    public activetab: objectTab;

    constructor(private metadata: metadata, private navigation: navigation) {
        this.navigation.activeTab$.subscribe(tabid => {
            if (tabid == 'main') {
                this.activetab = this.navigation.maintab;
            } else {
                this.activetab = this.navigation.getTabById(tabid);
            }
        });
    }

    /**
     * returns the parent tab
     */
    get parenttab() {
        return this.activetab.parentid ? this.navigation.getTabById(this.activetab.parentid) : this.activetab;
    }

    /**
     * do not show when no subtabs are enables or tab is main (main has no subtabs at this point in time
     */
    get displaySubtabs() {
        return this.navigation.navigationparadigm == 'subtabbed' && this.activetab && (this.activetab.parentid || this.navigation.getSubTabs(this.activetab.id).length > 0);
    }
}
