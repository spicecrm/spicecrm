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
 * @module ModuleACLTerritories
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {territories} from '../../../services/territories.service';

/**
 * renders a modal allowing the user to find a territory and select it
 */
@Component({
    templateUrl: './src/modules/aclterritories/templates/fieldterritorysearchmodal.html'
})
export class fieldTerritorySearchModal implements OnInit {

    /**
     * reference to self
     */
    private self: any;

    /**
     * a string to search for
     */
    private searchTerm: string = '';

    /**
     * the territories returned by the current search
     */
    private searchterritories: any[] = [];

    /**
     * for a potential later to be implemtned filter by the territory elementvalues
     */
    private moduleElements: any[] = [];
    private moduleElementsValues: any = {};

    /**
     * the event emitter to emit when a territory has been selected
     */
    @Output() private selectedTerritory: EventEmitter<any> = new EventEmitter<any>();


    constructor(private metadata: metadata, public model: model, public language: language, private territories: territories) {
    }

    /**
     * initialize and load tarritories
     */
    public ngOnInit(): void {
        // get the type paramaters
        let paramaters = this.territories.getModuleParamaters(this.model.module);
        this.moduleElements = paramaters.elements;

        // initialize the Element Values Array
        for (let moduleElement of this.moduleElements) {
            this.moduleElementsValues[moduleElement.id] = [];
        }

        // determine the active territories
        let activeTerritories = [];
        activeTerritories.push(this.model.getFieldValue('spiceacl_primary_territory'));

        let spiceacl_secondary_territories = this.model.getFieldValue('spiceacl_secondary_territories');
        for (let territory of JSON.parse(spiceacl_secondary_territories ? spiceacl_secondary_territories : '[]')) {
            activeTerritories.push(territory.id);
        }

        // search for territories
        this.searchterritories = this.territories.searchTerritories(this.model.module, '', 999, activeTerritories, this.model.isNew ? 'create' : 'edit');


        // extract options for the dropdowns
        for (let searchterritory of this.searchterritories) {
            for (let elementid in searchterritory.elementvalues) {
                if (!this.moduleElementsValues[elementid].find(rec => rec.elementvalue == searchterritory.elementvalues[elementid].elementvalue)) {
                    this.moduleElementsValues[elementid].push({
                        elementvalue: searchterritory.elementvalues[elementid].elementvalue,
                        elementdescription: searchterritory.elementvalues[elementid].elementdescription
                    });
                }
            }
        }
    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * returns the elemtn value or an empty string is not defined
     *
     * @param territory the territory
     * @param elementidthe id of the value
     */
    private getElementValue(territory, elementid) {
        try {
            return territory.elementvalues[elementid].elementdescription;
        } catch (e) {
            return '';
        }
    }

    /**
     * sets teh territory, emits the data and closes the modal
     *
     * @param territory the territory object
     */
    private selectTerritory(territory) {
        this.selectedTerritory.emit(territory);
        this.close();
    }
}
