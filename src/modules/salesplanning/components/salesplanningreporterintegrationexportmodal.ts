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
 * @module ModuleReportsMore
 */
import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

/**
 * an export component for the reporter that allows wroiting the plannign nodes form the report
 */
@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningreporterintegrationexportmodal.html'
})
export class SalesPlanningReporterIntegrationExportModal implements OnInit {

    /**
     * reference to self
     */
    private self: any;

    /**
     * an aray of planning versions
     */
    private salespanningversions: any [] = [];

    /**
     * the selected version
     */
    private _selectedversion: string = '';

    /**
     * holds the characteristics for the selected version
     */
    private scopesetcharacteristics: any[] = [];

    /**
     * the node name fields
     */
    private nodenamefield: string = '';

    /**
     * an array with the reporterfields
     * gets decoded once and then used in various select fields
     */
    private reporterFields: any[] = [];

    /**
     * indicates that the chars are getting loaded
     */
    private characteristicsloading: boolean = false;

    /**
     * array holding the set values for the territory
     */
    private territory: any = {
        fixedvalue: '',
        fixedvalues: [],
        valuefield: '',
        namefield: ''
    };

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model) {
    }

    /**
     * on initialization load the current planningversions
     *
     * break down the reported data and extract the fields
     */
    public ngOnInit(): void {
        this.backend.getRequest('module/SalesPlanningVersions', {limit: '-99', fields: '*'}).subscribe(versions => {
            this.salespanningversions = versions.list;
        });

        this.backend.getRequest('module/SalesPlanningTerritories', {
            limit: '-99',
            fields: JSON.stringify(['name', 'id'])
        }).subscribe(territories => {
            this.territory.fixedvalues = territories.list;
        });

        // get the reporter Fields
        this.reporterFields = this.model.getField('listfields');
    }

    /**
     * getter for the selectedverison
     */
    get selectedversion() {
        return this._selectedversion;
    }

    /**
     * setter for the selected version that also reloads the characteritics
     *
     * @param selectedversion
     */
    set selectedversion(selectedversion) {
        if (this._selectedversion != selectedversion) {
            this._selectedversion = selectedversion;

            // get the current version and get the scopeset
            let currentversion = this.salespanningversions.find(version => version.id == selectedversion);
            this.getCharacteristics(currentversion.salesplanningscopeset_id);
        }
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * loads the charcateritiscs for the planning version from the backend
     *
     * @param scopeSetId
     */
    private getCharacteristics(scopeSetId) {
        // set to loading
        this.characteristicsloading = true;

        // reset the chars array
        this.scopesetcharacteristics = [];

        // backend call
        this.backend.getRequest('module/SalesPlanningScopeSets/getScopeCharacteristics/' + scopeSetId).subscribe(
            scopesetcharacteristics => {
                for (let scopesetcharacteristic of scopesetcharacteristics) {
                    if (scopesetcharacteristic.id != 'territory') {
                        this.scopesetcharacteristics.push({
                            name: scopesetcharacteristic.name,
                            id: scopesetcharacteristic.id,
                            type: 'report',
                            namefield: null,
                            valuefield: null,
                            fixedvalue: null,
                            fixedvalues: []
                        });

                        // for each characteristic get the values
                        this.backend.getRequest('module/SalesPlanningCharacteristics/CharacteristicValues/' + scopesetcharacteristic.id).subscribe(charvalues => {
                            let char = this.scopesetcharacteristics.find(char => char.id == scopesetcharacteristic.id);
                            char.fixedvalues = charvalues;
                        });

                        // set loading indicator to false
                        this.characteristicsloading = false;
                    }
                }
            },
            error => {
                // set loading indicator to false
                this.characteristicsloading = false;
            });
    }

    /**
     * a getter that checks if we can export and if not is used to didable the export button
     */
    get canExport() {
        // not while we are loading
        if(this.characteristicsloading) return false;

        // need to have  planning version
        if (!this.selectedversion) return false;

        // need to have a tertritory value
        if (!this.territory.fixedvalue && !this.territory.valuefield) return false;

        // check for the nodename
        if (!this.nodenamefield || this.nodenamefield == '') return false;

        // check for all mapped chars
        for (let scopesetcharacteristic of this.scopesetcharacteristics) {
            if (!(scopesetcharacteristic.fixedvalue || (scopesetcharacteristic.valuefield && scopesetcharacteristic.namefield))) {
                return false;
            }
        }

        return true;
    }

    /**
     * exports the planning data
     */
    private exportPlanningScope() {
        // build wherecondition
        /*
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }
         */

        let currentversion = this.salespanningversions.find(version => version.id == this._selectedversion);

        let params = {
            nodeName: this.nodenamefield,
            mapping: [{
                charid: 'territory',
                fieldvalue: this.territory.valuefield,
                fieldname: null,
                fixedvalue: this.territory.fixedvalue
            }]
        };

        for (let scopesetcharacteristic of this.scopesetcharacteristics) {
            params.mapping.push({
                charid: scopesetcharacteristic.id,
                fieldvalue: scopesetcharacteristic.valuefield,
                fieldname: scopesetcharacteristic.namefield,
                fixedvalue: scopesetcharacteristic.fixedvalue
            });
        }

        this.backend.postRequest(`module/SalesPlanningScopeSets/${currentversion.salesplanningscopeset_id}/createFromKReport/${this.model.id}`, {}, params).subscribe(result => {
            this.close();
        });

    }
}
