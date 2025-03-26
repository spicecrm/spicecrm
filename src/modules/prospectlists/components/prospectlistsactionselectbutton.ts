import {Component, SkipSelf} from '@angular/core';
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
     * open set targets email address modal before adding the selected items
     * @param selectedItems
     */
    public addSelectedItems(selectedItems) {
        const addrField = this.actionconfig?.email_address_field_name ?? 'prospectlists_person_email_addr_bean_rel_id';
        const items = this.model.module == 'ProspectLists' ? [this.parent.data] : selectedItems.filter(item => Object.keys(item.email_addresses.beans).filter(relId => item.email_addresses.beans[relId].invalid_email != 1).length > 0);

        if (items.length == 0) return;

        const completedItems = [];

        items.forEach(e => {

            const emailAddresses: any[] = Object.values(this.model.module == 'ProspectLists' ? this.model.parentmodel.data.email_addresses.beans : e.email_addresses.beans);

            if (emailAddresses.length == 1 && emailAddresses[0].primary_address == 1) {
                e[addrField] = emailAddresses[0].relid;
                completedItems.push(e.id);
            }
            else {
                e[addrField] = emailAddresses.find(e => e.primary_address == 1).relid;
            }
        });

        if (completedItems.length == items.length) {
            this.relatedmodels.addItems(items);

        } else {
            this.modal.openStaticModal( ProspectListsSetTargetsEmailAddressModal, true, this.model.injector).subscribe(modalRef => {
                modalRef.instance.items = items;
                modalRef.instance.completedItemsIds = completedItems;
                modalRef.instance.emailAddressFieldName = addrField;

                modalRef.instance.response.subscribe(relData => {

                    if (this.model.module == 'ProspectLists') {

                        relData.forEach(e =>
                            e[addrField] = this.parent.data[addrField]
                        );
                    }

                    this.relatedmodels.addItems(relData);
                });
            });
        }
    }
}