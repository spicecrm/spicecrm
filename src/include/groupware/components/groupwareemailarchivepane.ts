/**
 * @module ModuleGroupware
 */
import {Component, OnInit} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {metadata} from "../../../services/metadata.service";

/**
 * A groupware container for the tabs and their content.
 * Those include: beans list, search pane, attachment list, linked bean list.
 */
@Component({
    selector: 'groupware-email-archive-pane',
    templateUrl: './src/include/groupware/templates/groupwareemailarchivepane.html'
})
export class GroupwareEmailArchivePane implements OnInit{
    /**
     * Currently active tab.
     */
    private activetab: number = 0;

    /**
     * the component config
     */
    public componentconfig: any;

    constructor(
        private metadata: metadata,
        private groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    /**
     * loads the componentconfig if not passed in
     */
    public ngOnInit() {
        // check that we have a config if no load it
        if(!this.componentconfig){
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
    }

    /**
     * a simple getter to see if the tabs are defined
     */
    private getTabs() {
        try {
            return this.componentconfig ? this.componentconfig : [];
        } catch (e) {
            return [];
        }
    }

    private setActiveTabIndex(index){
        this.activetab = index;
    }

    /**
     * Sets a tab as open and displays its content.
     * @param tab
     */
    private open(tab) {
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
