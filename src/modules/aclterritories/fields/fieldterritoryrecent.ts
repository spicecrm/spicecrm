/**
 * @module ModuleACLTerritories
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {territories} from '../../../services/territories.service';

@Component({
    selector: 'field-territory-recent',
    templateUrl: '../templates/fieldterritoryrecent.html'
})
export class fieldTerritoryRecent {
    /**
     * array with the recent territories to be displayed
     */
    public recentterritories: any[] = [];

    /**
     * event emitter when a territory is selected
     */
    @Output() public selectedTerritory: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public model: model, public language: language, public modal: modal, public territories: territories) {
        this.recentterritories = this.territories.getRecentTerritories(this.model.module, 50, this.model.isNew ? 'create': 'edit');
    }

    /**
     * the handler for the click on the territory
     *
     * @param territory the territory that has been selected
     */
    public setTerritory(territory) {
        this.selectedTerritory.emit(territory);
    }
}
