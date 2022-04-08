import {Component, OnInit, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {modelutilities} from "../../../services/modelutilities.service";
import {ServiceOrderEffortPanel} from "./serviceordereffortpanel";

@Component({
    templateUrl: "../templates/serviceordereffortconfirmationpanel.html"
})
export class ServiceOrderEffortConfirmationPanel extends ServiceOrderEffortPanel implements OnInit {

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public metadata: metadata,
        public view: view,
        public injector: Injector,
        public utils: modelutilities,
    ) {
        super(language, model, modal, metadata, view, injector, utils);
    }


    /*
    * set all variables from the config
    */
    public setComponentConfig() {
        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ServiceOrderEffortConfirmationPanel', this.model.module);
        this.fieldset = this.componentconfig.fieldset;
        this.sortField = this.componentconfig.sortField;
        this.relation_link_name = this.componentconfig.relation_link_name;
        this.product_filter = this.componentconfig.product_filter;
        this.productvariant_filter = this.componentconfig.productvariant_filter;
        this.detail_fieldset = this.componentconfig.detail_fieldset;
    }

    public openAddModal(itemType) {
        this.modal.openModal("ObjectModalModuleLookup", true, this.injector).subscribe(selectModal => {
            selectModal.instance.module = itemType;
            selectModal.instance.multiselect = true;
            selectModal.instance.relateFilter = itemType=="ProductVariants" ? this.productvariant_filter : this.product_filter;
            selectModal.instance.selectedItems.subscribe(items => {

                for (let product of items) {

                    let itemData: any = {};
                    itemData.id = this.utils.generateGuid();
                    itemData.deleted = false;
                    itemData.description = product.description;
                    itemData.parent_id = product.id;
                    itemData.parent_name = product.name;
                    itemData.uom_id = product.base_uom_id;
                    itemData.quantity = 1;
                    itemData.parent_type = this.currentProductType;
                    itemData.itemnr = (this.itemcount + 1) * 10;
                    itemData.confirmadded = true;

                    // set default acl to allow editing
                    itemData.acl = {
                        create: true,
                        edit: true
                    };

                    this.model.addRelatedRecords(this.relation_link_name, [itemData], false);
                }
                this.currentProductType = "";
            });
        });
    }
}
