import {Component, inject, Injector, SkipSelf} from '@angular/core';
import {ProspectListsSetTargetsEmailAddressModal} from "./prospectlistssettargetsemailaddressmodal";
import {ObjectActionSelectButton} from "../../../objectcomponents/components/objectactionselectbutton";
import {model} from "../../../services/model.service";

@Component({
    selector: 'prospect-lists-action-select-button',
    template: '<span><system-label label="LBL_SELECT"></system-label></span>',
    providers: [model]
})
export class ProspectListsActionSelectButton extends ObjectActionSelectButton {
    /**
     * action config
     */
    public declare actionconfig: {email_address_field_name: string};
    /**
     * injected injector service
     * @private
     */
    private injector: Injector = inject(Injector);

    /**
     * open set targets email address modal before adding the selected items
     * @param selectedItems
     */
    public addSelectedItems(selectedItems) {
        const addrField = this.actionconfig?.email_address_field_name ?? 'prospectlists_person_email_addr_bean_rel_id';
        const invalidCheckFn = item => Object.keys(item.email_addresses.beans).filter(relId => item.email_addresses.beans[relId].invalid_email != 1).length > 0;
        let items = [];

        // if a list is adding targets filter out the targets with no valid email address
        if (this.model.module != 'ProspectLists') {
            items = selectedItems.filter(item => invalidCheckFn(item));
            // if the contact is adding related lists, then check on the target if at least one valid email address exists
        } else if(invalidCheckFn(this.parent.data)) {
            items = selectedItems;
        }

        if (items.length == 0) return;

        // if a list is adding targets, and it does not allow multiple emails per target skip the selection modal
        if (this.model.module != 'ProspectLists' && !this.parent.getField('allow_multiple_emails_per_target')) {
            this.relatedmodels.addItems(items);
            return;
        }

        const completedItemsIds = this.fillInEmailAddressRelIdFromPrimary(items, addrField);

        if (completedItemsIds.length == items.length) {
            this.relatedmodels.addItems(items);

        } else {
            this.openSelectionModal(items, completedItemsIds, addrField);
        }
    }

    /**
     * fill in email address rel field from primary email address on the target if it has only one email address
     * @param items
     * @param addrField
     * @private
     */
    private fillInEmailAddressRelIdFromPrimary(items, addrField): string[] {

        const completedItemsIds = [];

        items.forEach(e => {

            const emailAddresses: any[] = Object.values(this.model.module == 'ProspectLists' ? this.parent.data.email_addresses.beans : e.email_addresses.beans);
            const list = this.model.module == 'ProspectLists' ? e : this.parent.data;

            if (list.allow_multiple_emails_per_target != 1) {
                completedItemsIds.push(e.id);
            } else if (emailAddresses.length == 1 && emailAddresses[0].primary_address == 1 && emailAddresses[0].invalid_email != 1) {
                e[addrField] = emailAddresses[0].relid;
                completedItemsIds.push(e.id);
            } else {
                e[addrField] = emailAddresses.find(e => e.primary_address == 1).relid;
            }
        });

        return completedItemsIds;
    }

    /**
     * open selection modal
     * @param items
     * @param completedItemsIds
     * @param addrField
     * @private
     */
    private openSelectionModal(items, completedItemsIds: string[], addrField: string) {

        this.modal.openStaticModal( ProspectListsSetTargetsEmailAddressModal, true, this.injector).subscribe(modalRef => {
            modalRef.instance.parent = this.parent;
            modalRef.instance.items = items;
            modalRef.instance.completedItemsIds = completedItemsIds;
            modalRef.instance.emailAddressFieldName = addrField;

            modalRef.instance.response.subscribe(relData => {
                this.relatedmodels.addItems(relData);
            });
        });

    }
}