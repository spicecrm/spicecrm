/**
 * @module GlobalComponents
 */
import {
    Component, Input
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, objectTab} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-tabbed-subtab-item',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedsubtabitem.html'
})
export class GlobalNavigationTabbedSubtabItem {

    /**
     * the tab object
     */
    @Input() public object: objectTab;

    /**
     * set if this is the maintab that is also represented here
     */
    @Input() public ismain: boolean = false;

    constructor(private metadata: metadata, private language: language, private navigation: navigation) {

    }

    /**
     * returns the tabname
     */
    get tabname() {
        return this.object?.displayname ? this.object.displayname : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabmodule() {
        return this.object?.displaymodule ? this.object.displaymodule : undefined;
    }

    /**
     * returns the tab module if a module is set
     */
    get tabicon() {
        return this.object?.displayicon ? this.object.displayicon : undefined;
    }

    /**
     * returns if the tab is active
     * if it is the maintab no subtabs shoudl be active
     */
    get isActive() {
        return this.object && this.object.id == this.navigation.activeTab;
    }

    /**
     * sets the current tab as the active tab
     */
    private setActive() {
        this.navigation.setActiveTab(this.object.id);
    }

    /**
     * close the subtab
     */
    private closeSubTab() {
        this.navigation.closeObjectTab(this.object.id);
    }

    /**
     * returns if the tab is pinned
     */
    get pinned() {
        return this.object.pinned;
    }

    /**
     * close the tab
     */
    private pintab() {
        this.object.pinned = !this.object.pinned;
    }

}
