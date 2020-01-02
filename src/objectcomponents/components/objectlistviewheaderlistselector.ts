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
    templateUrl: './src/objectcomponents/templates/objectlistviewheaderlistselector.html'
})
export class ObjectListViewHeaderListSelector implements OnDestroy {
    /**
     * boolean variable if the menu is opened
     */
    private showMenu: boolean = false;

    /**
     * the clicklistener when the menu is opened so clicks on teh document can be caught
     */
    private clickListener: any;

    /**
     * the componentconfig
     */
    private componentconfig: any;

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
    constructor(private metadata: metadata, private userpreferences: userpreferences, private modellist: modellist, private language: language, private model: model, private elementRef: ElementRef, private renderer: Renderer2) {
        let componentconfig = this.metadata.getComponentConfig('ObjectListView', this.model.module);
        let items = this.metadata.getComponentSetObjects(componentconfig.componentset);
        this.componentconfig = {
            lists: []
        };
        for (let item of items) {
            this.componentconfig.lists.push({
                component: item.component,
                icon: item.componentconfig.icon,
                label: item.componentconfig.name
            });
        }

        // set the first as default list if not already one is set on the modellist
        if (!this.modellist.listcomponent) {
            let defaultlist = this.userpreferences.getPreference('defaultlisttype', this.modellist.module);
            if (!defaultlist) {
                defaultlist = this.componentconfig.lists[0].component;
            }

            // set the list component
            this.modellist.listcomponent = defaultlist;
        }

    }

    /**
     * check if the clicklistener is set and if yxes kill it
     */
    public ngOnDestroy(): void {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * triggers the menu to open or close
     */
    private toggleMenu() {
        this.showMenu = !this.showMenu;
        if (this.showMenu) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * handles the click event and deregisters the click handler
     * @param event
     */
    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
            this.clickListener();
        }
    }

    /**
     * getter for the current list icon
     */
    get currentListIcon() {
        let icon: string = '';
        if (this.componentconfig.lists) {
            let thislist = this.componentconfig.lists.find(list => list.component == this.modellist.listcomponent);
            icon = thislist.icon;
        }

        return icon;
    }

    /**
     * simple getter if the button shoudl be disabled
     */
    get disabled() {
        return !(this.componentconfig.lists.length > 1);
    }

    /**
     * sets the list type
     *
     * @param component
     */
    private setListtype(component) {
        // trigger the listtype on the modellist service
        this.modellist.listcomponent = component;
    }
}
