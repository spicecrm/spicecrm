/**
 * @module ModuleEvents
 */
import {Component, EventEmitter, Injector, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    selector: 'event-registration-modal-list',
    templateUrl: '../templates/eventregistrationmodallist.html',
    providers: [modellist]
})
export class EventRegistrationModalList {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) public tablecontent: ViewContainerRef;

    /**
     * emits when an item is selected and which items are selected
     */
    @Output() public selectedItems: EventEmitter<any> = new EventEmitter<any>();

    /**
     * contains the selected items
     */
    public selectedItem: any;

    public subscriptions: Subscription = new Subscription();

    constructor(public language: language, public injector: Injector, public modal: modal, public modellist: modellist) {

    }

    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        // this.model.module = this.module;
        this.modellist.useCache = false;
        this.modellist.initialize('ProspectLists');
        this.modellist.getListData();
    }

    /**
     * set to true to enable multiselect, default to false
     */
    public multiselect: boolean = true;

    /**
     * should deliver the full selected items
     * but this function is not called anywhere
     */
    public selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
    }

    /**
     * emit the click with the selected item
     * @param event
     * @param item
     */
    public clickRow(event, item) {
            this.selectedItems.emit([item]);
            // console.log(this.selectedItems[item]);
    }

    /**
     * scroll event handler for the infinite scrolling in the window
     * @param e
     */
    public onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
