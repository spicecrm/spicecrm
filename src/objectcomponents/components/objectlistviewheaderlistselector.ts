/**
 * @module ObjectComponents
 */
import {Component, Input, Output, Renderer2, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {userpreferences} from '../../services/userpreferences.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-listview-header-list-selector',
    templateUrl: '../templates/objectlistviewheaderlistselector.html'
})
export class ObjectListViewHeaderListSelector implements OnInit {

    /**
     * the componentconfig
     */
    public componentconfig: any;

    /**
     * loads the config for the ObjectLiustView with the items to be displayed as list view alternatives
     *
     * @param metadata
     * @param userpreferences
     * @param modellist
     * @param language
     * @param model
     * @param elementRef
     * @param renderer
     */
    constructor(public metadata: metadata,
                public userpreferences: userpreferences,
                public modellist: modellist,
                public language: language,
                public model: model,
                public elementRef: ElementRef,
                public renderer: Renderer2) {
    }

    /**
     * call the initialize method
     */
    public ngOnInit() {
        this.initialize();
    }

    /**
     * load the component config and update the standard list component if selected
     * @private
     */
    public initialize() {

        this.loadComponentConfig();

        if (!this.modellist.currentList) {
            return;
        }
        // set the default list component if the current list id is all or owner
        if (['all', 'owner'].indexOf(this.modellist.currentList.id) != -1) {
            this.modellist.updateStandardListsComponent(this.modellist.currentList.id, this.getDefaultComponent());
        }
    }

    /**
     * get the default component
     * @private
     */
    public getDefaultComponent() {
        let component = this.userpreferences.getPreference('defaultlisttype', this.modellist.module);
        return component || this.componentconfig.lists[0].component;
    }

    /**
     * load the component config and build the list of the available component
     * @private
     */
    public loadComponentConfig() {
        let config = this.metadata.getComponentConfig('ObjectListView', this.model.module);
        let items = this.metadata.getComponentSetObjects(config.componentset);
        this.componentconfig = {
            lists: items.map(item => ({
                component: item.component,
                icon: item.componentconfig.icon ? item.componentconfig.icon : 'list',
                label: item.componentconfig.name
            }))
        };
    }

    /**
     * getter for the current list icon
     */
    get currentListIcon() {
        let icon: string = '';
        if (this.componentconfig.lists) {
            let thislist = this.componentconfig.lists.find(list => list.component == this.modellist.currentList.listcomponent);
            icon = thislist?.icon;
        }

        return icon;
    }

    /**
     * simple getter if the button shoudl be disabled
     */
    get disabled() {
        return this.componentconfig.lists.length <= 1;
    }

    /**
     * sets the list type
     *
     * @param component
     */
    public setListComponent(component) {
        if (!this.modellist.currentList) {
            return;
        }
        if (['all', 'owner'].indexOf(this.modellist.currentList.id) != -1) {
            this.modellist.updateStandardListsComponent(this.modellist.currentList.id, component);
        } else {
            this.modellist.updateListTypeComponent(component);
        }
    }
}
