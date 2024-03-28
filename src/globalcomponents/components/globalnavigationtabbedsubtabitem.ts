/**
 * @module GlobalComponents
 */
import {
    Component, ElementRef, Input
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, objectTab} from '../../services/navigation.service';

@Component({
    selector: 'global-navigation-tabbed-subtab-item',
    templateUrl: '../templates/globalnavigationtabbedsubtabitem.html'
})
export class GlobalNavigationTabbedSubtabItem {
    /**
     * show contextMenu boolean
     */
    public showContextMenu: boolean = false;

    /**
     * the tab object
     */
    @Input() public object: objectTab;

    /**
     * set if this is the maintab that is also represented here
     */
    @Input() public ismain: boolean = false;

    constructor(public metadata: metadata,public language: language,public navigation: navigation, public elementRef: ElementRef) {

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
   public setActive() {
        this.navigation.setActiveTab(this.object.id);
    }

    /**
     * close the subtab
     */
   public closeSubTab() {
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
   public pintab() {
        this.object.pinned = !this.object.pinned;
    }

    /**
     * returns subtabs
     */
    get subTabs(): objectTab[] {
        return this.navigation.objectTabs.filter(tab => tab.parentid !== undefined);
    }

    /**
     * returns true if unsaved changed are in tab object
     */
    get isDirty() {
        return this.navigation.anyDirtyModel(this.object.id);
    }


}
