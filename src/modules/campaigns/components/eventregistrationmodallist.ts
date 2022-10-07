/**
 * @module ModuleCampaigns
 */
import {Component, EventEmitter, Injector, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";
import {modellist} from "../../../services/modellist.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'event-registration-modal-list',
    templateUrl: '../templates/eventregistrationmodallist.html',
    providers: [modellist]
})
export class EventRegistrationModalList {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) public tablecontent: ViewContainerRef;

    constructor(public language: language, public model: model, public injector: Injector, public modal: modal, public modellist: modellist) {

    }

    public selectedItem: any;

    public subscriptions: Subscription = new Subscription();

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    get module() {
        return this.model.getField('module_name');
    }

    get placeholder() {
        // return default placeholder
        return this.module ? this.language.getModuleCombinedLabel('LBL_SEARCH', this.module) : this.language.getLabel('LBL_SEARCH');
    }

    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        // this.model.module = this.module;
        this.modellist.useCache = false;
        this.modellist.initialize('ProspectLists');
        this.modellist.getListData();

        // set hte module on the model
        this.model.module = this.module;
    }

    /**
     * set to true to enable multiselect, default to false
     */
    public multiselect: boolean = true;

    /**
     * emits when an item is selected and which items are selected
     */
    @Output() public selectedItems: EventEmitter<any> = new EventEmitter<any>();

    public selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
    }

    public clickRow(event, item) {
        if (!this.multiselect) {
            this.selectedItems.emit([item]);
        }
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

    // public execute() {
    //     this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
    //         selectModal.instance.module = 'ProspectLists';
    //         selectModal.instance.multiselect = true;
    //         this.subscriptions.add(
    //             selectModal.instance.selectedItems.subscribe(items => {
    //                 if (items.length) {
    //                     this.selectedItem = {
    //                         id: items[0].id,
    //                         summary_text: items[0].summary_text,
    //                         module: this.module,
    //                         data: items[0]
    //                     };
    //                 }
    //             })
    //         );
    //     });
    // }

}
