/**
 * @module ObjectComponents
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {session} from '../../services/session.service';

/**
 * renders a tabcontainer with separate tabs
 */
@Component({
    selector: 'object-tab-container',
    templateUrl: '../templates/objecttabcontainer.html'
})
export class ObjectTabContainer implements OnInit {
    /**
     * the index of the active tab
     */
    public activeTab: number = 0;

    /**
     * holds which tabs have been activated. Since they are only rnedered when clicked or set to forcerender
     */
    public activatedTabs: number[] = [0];

    /**
     * the componentconfig
     */
    public componentconfig: any;

    /**
     * the tabs to be rendered
     */
    public tabs: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model, protected session: session) {

    }

    /**
     * loads the tabs
     */
    public ngOnInit() {
        if (this.componentconfig && this.componentconfig.componentset) {
            let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
            this.tabs = [];
            for (let item of items) {
                // check if the tab is admin access only
                if (item.componentconfig.adminonly && !this.session.isAdmin) continue;

                this.tabs.push(item.componentconfig);
            }
        } else {
            let componentconfig = this.metadata.getComponentConfig('ObjectTabContainer', this.model.module);
            let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
            this.tabs = [];
            for (let item of items) {
                // check if the tab is admin access only
                if (item.componentconfig.adminonly && !this.session.isAdmin) continue;

                this.tabs.push(item.componentconfig);
            }
        }
    }

    /**
     * returns if the item is hideden
     * @param itemconfig
     */
    public isHidden(itemconfig){
        // check that we have acl access
        if(itemconfig.acl && !this.model.checkAccess(itemconfig.acl)) return true;

        // check that we have mode state access
        if(itemconfig.requiredmodelstate && !this.model.checkModelState(itemconfig.requiredmodelstate)) return true;

        return false;
    }

    /**
     * chanmge teh active tab and render it
     * @param index
     */
    public setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /**
     * checks if the tab is to be rendered or forced to be rendered. If not is will be (by ngIf only be rendered when the tab is selected
     * @param tabindex
     */
    public checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.tabs && this.tabs[tabindex].forcerender);
    }
}
