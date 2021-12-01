/**
 * @module ModuleGroupware
 */
import {Component, OnInit} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

/**
 * A groupware container for the tabs and their content.
 * Those include: beans list, search pane, attachment list, linked bean list.
 */
@Component({
    selector: 'groupware-email-archive-pane',
    templateUrl: '../templates/groupwareemailarchivepane.html',
    providers: [view]
})
export class GroupwareEmailArchivePane implements OnInit {
    /**
     * Currently active tab.
     */
    public activetab: number = 0;

    /**
     * the component config
     */
    public componentconfig: any;

    constructor(
        public metadata: metadata,
        public view: view,
        public groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    /**
     * @return boolean if the system is archiving
     */
    get isLoading(): boolean {
        return this.groupware.isArchiving;
    }

    /**
     * loads the componentconfig if not passed in
     */
    public ngOnInit() {
        // check that we have a config if no load it
        if(!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig('GroupwareEmailArchivePane');
        }

        // get the panels and load the panel item configs and store them
        if (this.componentconfig && this.componentconfig.componentset) {
            let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
            this.componentconfig = [];
            for (let item of items) {
                // else add the tab
                this.componentconfig.push(item.componentconfig);
            }
        }

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * a simple getter to see if the tabs are defined
     */
    public getTabs() {
        try {
            return this.componentconfig ? this.componentconfig : [];
        } catch (e) {
            return [];
        }
    }

    public setActiveTabIndex(index){
        this.activetab = index;
    }

    /**
     * Sets a tab as open and displays its content.
     * @param tab
     */
    public open(tab) {
        this.activetab = tab;
    }

    /**
     * Checks if the current email has already been archived in SpiceCRM.
     */
    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
