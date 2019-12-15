/**
 * @module ModuleACLTerritories
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {fts} from '../../../services/fts.service';
import {modal} from '../../../services/modal.service';
import {territories} from '../../../services/territories.service';

@Component({
    selector: 'field-territory-recent',
    templateUrl: './src/modules/aclterritories/templates/fieldterritoryrecent.html'
})
export class fieldTerritoryRecent {
    /**
     * array with the recent territories to be displayed
     */
    private recentterritories: any[] = [];

    /**
     * event emitter when a territory is selected
     */
    @Output() private selectedTerritory: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, public model: model, public fts: fts, public language: language, private modal: modal, private territories: territories) {
        this.recentterritories = this.territories.getRecentTerritories(this.model.module, 50, this.model.isNew ? 'create': 'edit');
    }

    /**
     * the handler for the click on the territory
     *
     * @param territory the territory that has been selected
     */
    private setTerritory(territory) {
        this.selectedTerritory.emit(territory);
    }
}
