import {Component, ComponentRef, OnDestroy} from '@angular/core';
import {ModalComponentI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {Subject} from "rxjs";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'prospect-lists-set-targets-email-address-modal',
    templateUrl: '../templates/prospectlistssettargetsemailaddressmodal.html',
    providers: [view]
})

export class ProspectListsSetTargetsEmailAddressModal implements ModalComponentI, OnDestroy {
    /**
     * component instance reference
     */
    self: ComponentRef<ProspectListsSetTargetsEmailAddressModal>;
    /**
     * items passed from the parent component
     */
    public items: { id: string, summary_text: string, email_addresses: {beans: any};}[] = [];
    /**
     * filtered items by show/hide all action needed
     */
    public filteredItems: { id: string, summary_text: string, allow_multiple_emails_per_target?: boolean, email_addresses: {beans: any};}[] = [];
    /**
     * list of completed items ids
     */
    public _completedItemsIds: string[] = [];
    /**
     * modal response to pass data to parent
     */
    public response = new Subject<{ id: string}[]>();
    /**
     * email address field name
     */
    public emailAddressFieldName: string;

    public showAll: boolean = false;
    /**
     * reference to the parent model
     */
    public parent: model;

    constructor(public model: model, private view: view) {
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    set completedItemsIds(val) {
        this._completedItemsIds = val;
        this.setFilteredItems();
    }

    get completedItemsIds() {
        return this._completedItemsIds;
    }

    public close() {
        this.response.complete();
        this.self.destroy();
    }

    public confirm() {
        this.response.next(this.items);
        this.close();
    }
    public setShowAll(val) {
        this.showAll = val;
        this.setFilteredItems();
    }

    /**
     * set filtered items by the flag showAll
     * @private
     */
    private setFilteredItems() {
        if (this.showAll) {
            this.filteredItems = this.items;
        } else {
            this.filteredItems = this.items.filter((e) => !this.completedItemsIds.includes(e.id));
        }
    }

    public ngOnDestroy() {
        this.response.complete();
    }
}