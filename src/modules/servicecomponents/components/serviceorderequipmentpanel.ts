import {Component, OnInit, Injector, ChangeDetectorRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {modelutilities} from "../../../services/modelutilities.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    selector: "serviceorder-equipment-panel",
    templateUrl: "./src/modules/servicecomponents/templates/serviceorderequipmentpanel.html",
    providers: [relatedmodels, modellist]
})
export class ServiceOrderEquipmentPanel implements OnInit {

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
     * the used filter
     */
    public equipmentfilter: string = "";

    /**
     * the columns to be displayed
     */
    private fieldsetFields: any[] = [];

    /**
     * all selected items
     */
    private selected_items: any[] = [];

    /**
     * list of all ServiceEquipmentItems
     */
    private all_items: any = {};

    /**
     * sortfield
     */
    private sortField: string = 'date_entered';

    /**
     * the used fieldsets
     */
    public currentProductType: string = "";

    constructor(
        private language: language,
        // @SkipSelf() private parent: model,
        private model: model,
        private modal: modal,
        private metadata: metadata,
        private view: view,
        private injector: Injector,
        public utils: modelutilities,
        public relatedmodels: relatedmodels,
        private modellist: modellist,
        public cdRef: ChangeDetectorRef
    ) {

        // get the config
        this.componentconfig = this.metadata.getComponentConfig('ServiceOrderEquipmentPanel', this.model.module);
    }
    public ngOnInit() {
        this.setComponentConfig();
        this.getFieldsetFields();
        this.setAllItems();
    }

    /*
    * set all variables from the config
    */
    public setComponentConfig() {
        this.fieldset = this.componentconfig.fieldset;
        this.sortField = this.componentconfig.sortField;
        this.relation_link_name = this.componentconfig.relation_link_name;
        this.equipmentfilter = this.componentconfig.equipmentfilter;
    }
    /*
    * get the fieldsetfields
    */
    public getFieldsetFields() {
        if (this.componentconfig.fieldset) {
            this.fieldsetFields = this.metadata.getFieldSetFields(this.fieldset);
        }
    }


    /**
     * build the items and render them in the container
     */
    private setAllItems() {

        this.modellist.setModule("ServiceEquipments");
        if (this.sortField) {
            this.modellist.setSortField(this.sortField, "DESC", false);
        }
        this.modellist.filtercontextbeanid = this.model.id;
        this.modellist.modulefilter = this.equipmentfilter;
        let requestedFields = ['name', 'servicelocation_name'];

        this.modellist.getListData(requestedFields).subscribe(data => {
            if(data) {
                let all_items = this.modellist.listData;
                this.setSelectedItems(all_items);
            }
        });
    }

    /**
     * returns the number of not deleted items
     */
    private setSelectedItems(all_items) {
        this.selected_items = this.model.getRelatedRecords(this.relation_link_name);
        for (let aitem of all_items.list) {
            aitem.selected = false;
            for (let sitem of this.selected_items) {
                if(aitem.id == sitem.id) {
                    aitem.selected = true;
                }
            }
        }
        this.all_items = all_items;
    }

    /**
     * returns current items with the selected info
     */
    get items() {
        this.setSelectedItems(this.all_items);
        return this.all_items;
    }

    /**
     * returns the number of not deleted items
     */
    get itemcount() {
        if (this.all_items) {
            if (this.all_items.list) {
                let items = this.all_items.list.filter(item => item.deleted != 1);
                if (items) {
                    return items.length;
                }
            }
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
        this.openAddModal();
    }

    private openAddModal() {
        this.modal.openModal("ObjectModalModuleLookup", true, this.injector).subscribe(selectModal => {
            selectModal.instance.module = "ServiceEquipments";
            selectModal.instance.multiselect = true;
            selectModal.instance.relateFilter = this.equipmentfilter;
            selectModal.instance.selectedItems.subscribe(items => {

                this.model.addRelatedRecords(this.relation_link_name, items, false);
                this.view.setEditMode();
            });
        });
    }
}
