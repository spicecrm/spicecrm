/**
 * @module ObjectComponents
 */
import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {session} from '../../services/session.service';
import {model} from '../../services/model.service';

/**
 * renders a vertical tab container
 */
@Component({
    selector: 'object-vertical-tab-container',
    templateUrl: '../templates/objectverticaltabcontainer.html',
    styles: [
            `.slds-is-active {
            font-weight: 600;
            color: #3e3e3c;
            border-right: 1px solid #dddbda;
            border-left: 6px solid #CA1B21;
        }

        .slds-is-active a {
            text-decoration: none !important
        }`,
        '.slds-badge { font-weight: bold; background-color: #c00; color: #fff; padding: .125rem .4rem; }'
    ]
})
export class ObjectVerticalTabContainer implements OnInit {

    /**
     * the reference to the container
     */
    @ViewChild('tabscontainer', {read: ViewContainerRef, static: true}) public tabscontainer: ViewContainerRef;

    /**
     * the number of the active tab
     */
    public activeTab: number = 0;

    /**
     * holds which tabs have been activated already. Since tabs are only rendered when selected
     * for performance reasons this is the array to hold which have been rendered already
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

    constructor(public language: language, public metadata: metadata, public session: session, private model: model) {
    }

    /**
     * loads the componentconfig if not passed in
     */
    public ngOnInit() {
        if (this.componentconfig && this.componentconfig.componentset) {
            let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
            this.componentconfig = [];
            for (let item of items) {
                // check if the tab is admin access only
                if (item.componentconfig.adminonly && !this.session.isAdmin) continue;

                // else add the tab
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
     * sets the index passed in as active tab
     *
     * @param index
     */
    public setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /**
     * checks if the tab with the given index is rendered already
     *
     * @param tabindex
     */
    public checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1 || (this.tabs && this.tabs[tabindex].forcerender);
    }

    /**
     * gets the style display property for the tab
     * @param tabindex
     */
    public getDisplay(tabindex) {
        let rect = this.tabscontainer.element.nativeElement.getBoundingClientRect();

        if (tabindex !== this.activeTab) {
            return {
                display: 'none'
            };
        }

        return {
            height: 'calc(99.9vh - ' + (rect.top) + 'px)'
        };
    }

    /**
     * retruns a specific sylte for the tab header
     *
     * ToDo: check if we still need this
     */
    public getTabsStyle() {
        let rect = this.tabscontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(99.9vh - ' + (rect.top) + 'px)',
            'overflow': 'auto',
            'overflow-x': 'hidden'
        };
    }

    /**
     * passes in if there are errors on the tab
     *
     * ToDo: check if we still need this
     *
     * @param tabindex
     * @param nrErrors
     */
    public showErrorsOnTab(tabindex, nrErrors) {
        this.componentconfig[tabindex].hasErrors = nrErrors;
    }

}
