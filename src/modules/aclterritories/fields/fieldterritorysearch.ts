/**
 * @module ModuleACLTerritories
 */
import {Component,  Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {fts} from '../../../services/fts.service';
import {modal} from '../../../services/modal.service';
import {territories} from '../../../services/territories.service';

@Component({
    selector: 'field-territory-search',
    templateUrl: '../templates/fieldterritorysearch.html'
})
export class fieldTerritorySearch {
    public searchTerm: string = '';
    public searchTimeout: any = {};
    public searchterritories: any[] = [];

    @Output() public selectedTerritory: EventEmitter<any> = new EventEmitter<any>();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    };

    constructor(public metadata: metadata, public model: model, public fts: fts, public language: language, public modal: modal, public territories: territories) {
    }

    public doSearch() {
        let activeTerritories = [];
        activeTerritories.push(this.model.getFieldValue('spiceacl_primary_territory'));

        let spiceacl_secondary_territories = this.model.getFieldValue('spiceacl_secondary_territories');
        for (let territory of JSON.parse(spiceacl_secondary_territories ? spiceacl_secondary_territories : '[]')) {
            activeTerritories.push(territory.id);
        }

        this.searchterritories = this.territories.searchTerritories(this.model.module, this.searchTerm, 5, activeTerritories, this.model.isNew ? 'create': 'edit');
    }

    public setTerritory(territory) {
        this.searchTerm = '';
        this.selectedTerritory.emit(territory);
    }
}
