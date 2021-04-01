/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/modules/salesdocs/templates/salesdocsequipmentpanel.html",
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
    private fieldsetFields: any[] = [];

    /**
     * list of all selected service equipments
     */
    private selectedEquipments: any[] = [];

    /**
     * list of all service equipments
     */
    private availableEquipments: any = {};

    /**
     * sortfield
     */
    private sortField = 'date_entered';

    /**
     * Defines if the panel is expanded or collapsed. Expanded by default.
     */
    private expanded = true;

    /**
     * Remember the current account (ordering party) to detect modification.
     */
    private currentAccount = '';

    constructor( private model: model, private metadata: metadata, private view: view, private modellist: modellist ) { }

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
    private fetchAvailableEquipments() {
        let accountId = this.model.getField('account_op_id');
        if ( accountId ) {
            this.modellist.setModule( 'ServiceEquipments' );
            if( this.sortField ) this.modellist.setSortField( this.sortField, 'DESC', false );
            this.modellist.filtercontextbeanid = accountId;
            this.modellist.modulefilter = this.equipmentfilter;
            let requestedFields = ['name', 'servicelocation_name'];
            this.modellist.getListData( requestedFields ).subscribe( data => {
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
    private assignSelectedEquipments() {
        this.selectedEquipments = this.model.getRelatedRecords('serviceequipments');
        for ( let availableEquipment of this.availableEquipments ) {
            availableEquipment.selected = this.selectedEquipments.some( selectedEquipment => availableEquipment.id === selectedEquipment.id );
        }
        this.selectionChanged();
    }

    /**
     * Does the account (ordering party) have service equipments?
     */
    private hasEquipments(): boolean {
        return this.availableEquipments.length > 0;
    }

    /**
     * In case one or more service equipments are selected,
     * it must not be allowed to change the ordering party account (because the service equipments are assigned to it).
     * So in this case set the field account_op_name to status "disabled". Or remove the disabled status, when no service equipment is selected any more.
     */
    private selectionChanged(): void {
        this.model.setFieldStatus('account_op_name', 'disabled', this.model.getRelatedRecords('serviceequipments').length > 0 );
    }

}
