/**
 * @module ModuleReportsMore
 */
import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../../../modules/reports/services/reporterconfig';


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
    private _selectedversion: string;

    /**
     * holds the characteristics for the selected version
     */
    private scopesetcharacteristics: any[] = [];

    /**
     * the node name fields
     */
    private nodenamefield: string;

    private reporterFields: any[] = [];

    private territory: any = {
        fixedvalue: '',
        fixedvalus: [],
        valuefield: '',
        namefield: ''
    }

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private reporterconfig: reporterconfig) {
    }

    /**
     * on initialization load the current planningversions
     *
     * break down the reported data and extract the fields
     */
    public ngOnInit(): void {
        this.backend.getRequest('/module/SalesPlanningVersions', {limit: '-99', fields: '*'}).subscribe(versions => {
            this.salespanningversions = versions.list;
        });

        this.backend.getRequest('/module/SalesPlanningTerritories', {limit: '-99', fields: JSON.stringify(['name', 'id'])}).subscribe(territories => {
            this.territory.fixedvalues = territories.list;
        });

        // get the reporter Fields
        this.reporterFields = JSON.parse(this.model.getField('listfields'));
    }

    get selectedversion() {
        return this._selectedversion;
    }

    set selectedversion(selectedversion) {
        this._selectedversion = selectedversion;

        // get the current version and get the scopeset
        let currentversion = this.salespanningversions.find(version => version.id == selectedversion);
        this.getCharacteristics(currentversion.salesplanningscopeset_id);
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    private getCharacteristics(scopeSetId) {
        this.backend.getRequest('/module/SalesPlanningScopeSets/getScopeCharacteristics/' + scopeSetId).subscribe(scopesetcharacteristics => {
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
                    this.backend.getRequest('module/SalesPlanningCharacteristics/CharacteristicValues/'+scopesetcharacteristic.id).subscribe(charvalues => {
                        let char = this.scopesetcharacteristics.find(char => char.id == scopesetcharacteristic.id);
                        char.fixedvalues = charvalues;
                    });
                }
            }
        });
    }

    private exportPlanningScope() {
        // build wherecondition
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

    }
}