/**
 * @module ObjectFields
 */
import {Component,  Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {fts} from '../../services/fts.service';
import {modal} from '../../services/modal.service';
import {territories} from '../../services/territories.service';

@Component({
    selector: 'field-territory-search',
    templateUrl: './src/objectfields/templates/fieldterritorysearch.html'
})
export class fieldTerritorySearch {
    private searchTerm: string = '';
    private searchTimeout: any = {};
    private searchterritories: Array<any> = [];

    @Output() private selectedTerritory: EventEmitter<any> = new EventEmitter<any>();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    };

    constructor(private metadata: metadata, public model: model, public fts: fts, public language: language, private modal: modal, private territories: territories) {
    }

    private doSearch() {
        let activeTerritories = [];
        activeTerritories.push(this.model.getFieldValue('spiceacl_primary_territory'));

        let spiceacl_secondary_territories = this.model.getFieldValue('spiceacl_secondary_territories');
        for (let territory of JSON.parse(spiceacl_secondary_territories ? spiceacl_secondary_territories : '[]')) {
            activeTerritories.push(territory.id);
        }

        this.searchterritories = this.territories.searchTerritories(this.model.module, this.searchTerm, 5, activeTerritories);
    }

    private setTerritory(territory) {
        this.searchTerm = '';
        this.selectedTerritory.emit(territory);
    }
}
