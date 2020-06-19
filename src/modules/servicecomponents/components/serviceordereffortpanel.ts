import {Component, OnInit, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    selector: "serviceorder-effort-panel",
    templateUrl: "./src/modules/servicecomponents/templates/serviceordereffortpanel.html"
})
export class ServiceOrderEffortPanel implements OnInit {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * the used fieldsets
     */
    public fieldset: string = "";

    /**
     * the used relation name
     */
    public relation_link_name: string = "";

    /**
     * the used fieldsets
     */
    public product_filter: string = "";
    public productvariant_filter: string = "";

    /**
     * the fieldset for the detail toggle
     */
    public detail_fieldset: string = "";

    /**
     * the columns to be displayed
     */
    private fieldsetFields: any[] = [];

    /**
     * sortfield
     */
    private sortField: string = 'date_entered';

    /**
     * the columns to be displayed in detail container
     */
    private fieldsetDetailItems: any[] = [];

    /**
     * the used fieldsets
     */
    public currentProductType: string = "";

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private metadata: metadata,
        private view: view,
        private injector: Injector,
        public utils: modelutilities,
    ) {
        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ServiceOrderEffortPanel', this.model.module);
    }
    public ngOnInit() {
        this.setComponentConfig();
        this.getFieldsetFields();
    }

    /*
    * set all variables from the config
    */
    public setComponentConfig() {
        this.fieldset = this.componentconfig.fieldset;
        this.sortField = this.componentconfig.sortField;
        this.relation_link_name = this.componentconfig.relation_link_name;
        this.product_filter = this.componentconfig.product_filter;
        this.productvariant_filter = this.componentconfig.productvariant_filter;
        this.detail_fieldset = this.componentconfig.detail_fieldset;
    }
    /*
    * get the fieldsetfields
    */
    public getFieldsetFields() {
        if (this.componentconfig.fieldset) {
            this.fieldsetFields = this.metadata.getFieldSetFields(this.fieldset);
            this.fieldsetFields.shift();
        }

        this.fieldsetDetailItems = this.metadata.getFieldSetItems(this.detail_fieldset);
    }

    /*
     * @return model.relatedRecords
     */
    get items() {
        let items = this.model.getRelatedRecords(this.relation_link_name);
        return this.sortItems(items).filter(e => e.deleted == 0 || !e.deleted);
    }

    /*
     * @param value: any[]
     * @set model.relatedRecords
     */
    set items(value) {
        this.model.setRelatedRecords(this.relation_link_name, value);
    }

    /**
     * returns the number of not deleted items
     */
    get itemcount() {
        let items = this.items.filter(item => item.deleted != 1);
        if(items) {
            return items.length;
        }
    }

    /**
     * returns true if we are in edit mode
     */
    get editing() {
        return this.view.isEditMode();
    }


    /*
 * @sort items by sortField: moment.date
 * @return items: any[]
 */
    private sortItems(items) {
        return items.sort((a, b) => a[this.sortField] && b[this.sortField] ? a[this.sortField] > b[this.sortField] ? 1 : -1 : 0);
    }

    private addItem() {
        this.view.setEditMode();
        if(this.metadata.getModuleDefs("Products").acl.list && this.metadata.getModuleDefs("Products").visible) {
            if(this.metadata.getModuleDefs("ProductVariants").acl.list && this.metadata.getModuleDefs("ProductVariants").visible) {

                this.modal.openModal('ServiceOrderAddTypeSelector', true, this.injector).subscribe(addItemModal => {
                    addItemModal.instance.itemTypeSelected.subscribe(itemType => {
                        if (itemType) {
                            this.currentProductType = itemType;
                            this.openAddModal(itemType);
                        }
                    });
                });

            } else {
                this.openAddModal("Products");
            }
        }
    }

    private openAddModal(itemType) {
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
