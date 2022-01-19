/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef, OnDestroy, OnInit, EventEmitter, Output
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

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
     *
     * ToDo: remove from the legacy support that this can also be defined as JSON
     */
    public tabs: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model) {

    }

    /**
     * loads the tabs
     */
    public ngOnInit() {
        if (this.getTabs().length == 0) {
            if (this.componentconfig && this.componentconfig.componentset) {
                let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
                this.tabs = [];
                for (let item of items) {
                    this.tabs.push(item.componentconfig);
                }
            } else {
                let componentconfig = this.metadata.getComponentConfig('ObjectTabContainer', this.model.module);
                let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
                this.tabs = [];
                for (let item of items) {
                    this.tabs.push(item.componentconfig);
                }
            }
        } else {
            this.tabs = this.getTabs();
        }
    }

    /**
     * @deprecated
     *
     * legacy support to get tabs from the config. Shoudl be removd already in most of the config and no longer really be used
     *
     * ToDo: remove
     */
    public getTabs() {
        try {
            return this.componentconfig.tabs ? this.componentconfig.tabs : [];
        } catch (e) {
            return [];
        }
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
