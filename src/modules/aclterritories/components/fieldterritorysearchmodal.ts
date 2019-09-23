/**
 * @module ObjectFields
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
