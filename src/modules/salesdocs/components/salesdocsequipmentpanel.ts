/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from '../../../services/view.service';
import {modellist} from "../../../services/modellist.service";

// a little bit based on ServiceOrderEquipmentPanel

@Component({
    selector: "salesdocs-equipment-panel",
    templateUrl: "../templates/salesdocsequipmentpanel.html",
    providers: [modellist]
})
export class SalesDocsEquipmentPanel implements OnInit {

    /**
     * the component configuration
     */
    public componentconfig: any = {};

    /**
     * the used fieldset
     */
    public fieldset = '';

    /**
     * the used filter
     */
    public equipmentfilter = '';

    /**
     * the columns to be displayed
     */
    public fieldsetFields: any[] = [];

    /**
     * list of all selected service equipments
     */
    public selectedEquipments: any[] = [];

    /**
     * list of all service equipments
     */
    public availableEquipments: any = {};

    /**
     * sortfield
     */
    public sortField = 'date_entered';

    /**
     * Defines if the panel is expanded or collapsed. Expanded by default.
     */
    public expanded = true;

    /**
     * Remember the current account (ordering party) to detect modification.
     */
    public currentAccount = '';

    constructor( public model: model, public metadata: metadata, public view: view, public modellist: modellist ) { }

    public ngOnInit() {
        // get the config
        this.componentconfig = this.metadata.getComponentConfig('SalesDocsEquipmentPanel', 'SalesDocs');

        this.setComponentConfig();
        this.getFieldsetFields();
        this.fetchAvailableEquipments();

        // Listen to the SalesDocs model to get noticed, when the account has been set the first time or changed.
        // Then the list of related service equipments has to get rebuilt.
        this.model.data$.subscribe( () => {
            let dummy = this.model.getField('account_op_id');
            if ( dummy !== this.currentAccount ) {
                this.fetchAvailableEquipments();
                this.currentAccount = dummy;
            }
        });
    }

    /*
    * set all variables from the config
    */
    public setComponentConfig() {
        this.fieldset = this.componentconfig.fieldset;
        this.sortField = this.componentconfig.sortField;
        this.equipmentfilter = this.componentconfig.equipmentfilter;
    }

    /*
    * get the fieldsetfields
    */
    public getFieldsetFields() {
        if ( this.componentconfig.fieldset ) this.fieldsetFields = this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     * Fetch the available service equipments from the backend.
     */
    public fetchAvailableEquipments() {
        let accountId = this.model.getField('account_op_id');
        if ( accountId ) {
            this.modellist.initialize( 'ServiceEquipments' );
            if( this.sortField ) this.modellist.setSortField( this.sortField, 'DESC' );
            this.modellist.filtercontextbeanid = accountId;
            this.modellist.modulefilter = this.equipmentfilter;
            this.modellist.getListData().subscribe( data => {
                if ( data ) {
                    this.availableEquipments = this.modellist.listData.list;
                    this.assignSelectedEquipments();
                }
            } );
        } else {
            this.availableEquipments = [];
        }
    }

    /**
     * Assigns selection flags to the list off available service equipment.
     */
    public assignSelectedEquipments() {
        this.selectedEquipments = this.model.getRelatedRecords('serviceequipments');
        for ( let availableEquipment of this.availableEquipments ) {
            availableEquipment.selected = this.selectedEquipments.some( selectedEquipment => availableEquipment.id === selectedEquipment.id );
        }
        this.selectionChanged();
    }

    /**
     * Does the account (ordering party) have service equipments?
     */
    public hasEquipments(): boolean {
        return this.availableEquipments.length > 0;
    }

    /**
     * In case one or more service equipments are selected,
     * it must not be allowed to change the ordering party account (because the service equipments are assigned to it).
     * So in this case set the field account_op_name to status "disabled". Or remove the disabled status, when no service equipment is selected any more.
     */
    public selectionChanged(): void {
        this.model.setFieldStatus('account_op_name', 'disabled', this.model.getRelatedRecords('serviceequipments').length > 0 );
    }

}
