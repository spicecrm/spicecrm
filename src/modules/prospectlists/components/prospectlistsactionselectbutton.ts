import {Component} from '@angular/core';
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
     * @param event
     */
    public addSelectedItems(event) {

        const itemsWithSingleValidEmailAddress = event.filter(item => Object.keys(item.email_addresses.beans).filter(relId => item.email_addresses.beans[relId].invalid_email != 1).length == 1);
        const itemsWithMultipleValidEmailAddresses = event.filter(item => Object.keys(item.email_addresses.beans).filter(relId => item.email_addresses.beans[relId].invalid_email != 1).length > 1);

        this.relatedmodels.addItems(event).subscribe(() => {

            const addrField = this.actionconfig?.email_address_field_name ?? 'prospectlists_person_email_addr_bean_rel_id';

            if (itemsWithSingleValidEmailAddress.length > 0) {
                itemsWithSingleValidEmailAddress.forEach(item => {
                    item[addrField] = (Object.values(item.email_addresses.beans).find((item: any) => item.invalid_email != 1) as any).id
                });
                this.relatedmodels.updateItems(itemsWithSingleValidEmailAddress);
            }

            if (itemsWithMultipleValidEmailAddresses.length == 0) return;

            this.modal.openStaticModal(ProspectListsSetTargetsEmailAddressModal, true, this.model.injector).subscribe(modalRef => {

                modalRef.instance.items = itemsWithMultipleValidEmailAddresses;
                modalRef.instance.emailAddressFieldName = addrField;
                modalRef.instance.response.subscribe(relData => {
                    this.relatedmodels.updateItems(relData);
                });
            });
        });
    }
}