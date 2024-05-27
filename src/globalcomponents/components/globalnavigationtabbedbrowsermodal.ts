/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, Component, QueryList, ViewChildren, Input, ElementRef, Output, EventEmitter
} from '@angular/core';
import {navigation, objectTab} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * renders a modal with the list of tabs and allows closing them, navigating to as well as providing some additonal informations
 */
@Component({
    templateUrl: '../templates/globalnavigationtabbedbrowsermodal.html'
})
export class GlobalNavigationTabbedBrowserModal {
    /**
     * the tab object
     */
    @Input() public object: objectTab;

    /**
     * reference to the modal component
     */
   public self: any;

    constructor(public navigation: navigation,public language: language) {

    }

    /**
     * returns the total count of tabs
     */
    get tabs() {
        return this.navigation.objectTabs.length;
    }

    /**
     * returns the total count of models
     */
    get models() {
        return this.navigation.modelregister.length;
    }

    /**
     * returns all tabs without a parent
     */
    get maintabs() {
        return this.navigation.objectTabs.filter(tab => !tab.parentid);
    }

    public hasSubtabs(id: string): boolean{
        return this.navigation.objectTabs.some(tab => tab.parentid == id);
    }

    /**
     * returnst he subtabs for a given tabid
     * @param parenttab
     */
   public subtabs(parenttab): objectTab[] {
        return this.navigation.objectTabs.filter(tab => tab.parentid == parenttab);
    }

    /**
     * closes a tab
     * @param tabid
     */
   public closetab(tabid) {
        this.navigation.closeObjectTab(tabid);
    }

    /**
     * activate the tab with the given id and close the modal
     * @param tabid
     */
   public activateTab(tabid) {
        this.navigation.setActiveTab(tabid);
        this.close();
    }

    /**
     * pins the tab
     */
   public pintab(tab: objectTab) {
        tab.pinned = !tab.pinned;
        this.navigation.objectTabs.sort((a, b) => !a.pinned ? 1 : -1);
    }

    /**
     * clones the tab
     *
     * @param tab
     */
   public clonetab(tab: objectTab) {
        this.navigation.cloneTab(tab.id);
    }

    /**
     * close the modal
     */
   public close() {
        this.self.destroy();
    }

    /**
     * handles the drop event and resets the sequence fields
     * @param event
     */
    public drop(event: CdkDragDrop<objectTab[]>){

        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        //find the index of our item in objectTabs array & splice the item it out from where it was
        const previousIndex = this.navigation.objectTabs.findIndex(t => t.id == event.item.data.id);
        const item = this.navigation.objectTabs.splice(previousIndex, 1)[0];
        const itemId = this.navigation.getTabById(item.id);

        //find the index of the item to the left of the currentIndex & then the objectTab itself
        const itemToLeftIndex = event.currentIndex - 1;
        const itemToLeft = event.container.data[itemToLeftIndex];

        //we figure out the index/position of our dropped item
        const dropIndex = itemToLeft ?  this.navigation.objectTabs.findIndex(t => t.id == itemToLeft.id) + 1 : 0 //event.container.data.findIndex(t => t.id == event.item.data.id);

        //we splice in our item BEFORE the drop index.
        this.navigation.objectTabs.splice(dropIndex, 0, item);

        this.navigation.setSessionData();
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
