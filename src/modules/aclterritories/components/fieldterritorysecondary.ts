/**
 * @module ModuleACLTerritories
 */
import {Component, Renderer2, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {territories} from '../../../services/territories.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {Router} from '@angular/router';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

/**
 * renders a field to add secondary territories
 */
@Component({
    templateUrl: './src/modules/aclterritories/templates/fieldterritorysecondary.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldTerritorySecondary extends fieldGeneric {

    /**
     * indicates if the search is open
     */
    private territorySearchOpen: boolean = false;

    /**
     * the term we are searching for
     */
    private territorySearchTerm: string = '';

    /**
     * for the handling of the dropdown
     */
    private clickListener: any;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private renderer: Renderer2, private elementRef: ElementRef, private territoriesService: territories) {
        super(model, view, language, metadata, router);

    }

    /**
     * returns the id of the prmary territory of the model
     */
    get primary_territory_id() {
        return this.model.getFieldValue('spiceacl_primary_territory');
    }

    /**
     * returns an array of territories
     */
    get territories() {
        try {
            return JSON.parse(this.model.data.spiceacl_secondary_territories)
        } catch (e) {
            return [];
        }
    }

    /**
     * sets the territories
     *
     * @param value an array of territory ids
     */
    set territories(value) {
        this.model.data.spiceacl_secondary_territories = JSON.stringify(value ? value : []);
    }

    /**
     * triggered when the click in the field
     */
    private onClick() {
        this.territorySearchOpen = true;
    }

    /**
     * ensure the search is closed when the field fires a blur event
     */
    private onBlur() {
        if (this.territorySearchTerm == '') {
            this.territorySearchOpen = false;
        }
    }

    /**
     * triggered when a pill remove button is clicked and the territory is to be removed
     *
     * @param e the event passed  in with $event
     * @param territoryid the id of the territory
     */
    private removeTerritory(e, territoryid) {
        // stop the event here
        e.preventDefault();
        e.stopPropagation();

        // handle the deletion

        let territories = this.territories;
        territories.some((territory, index) => {
            if (territory.id == territoryid) {
                territories.splice(index, 1);
                return true;
            }
        });
        this.territories = territories;

    }

    /**
     * for the click handler to determine if we clicked outside or inside
     *
     * @param event the event
     */
    private handleClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            if (this.clickListener) this.clickListener();
            this.territorySearchTerm = '';
            this.territorySearchOpen = false;
        }
    }

    /**
     * adds a territory to the list of secondary tzerritories
     *
     * @param territory the territory id
     */
    private addTerritory(territory) {
        let territories = this.territories;
        if (territories == '') territories = [];
        territories.push(territory);
        this.territories = territories;
        this.territorySearchTerm = '';
        this.territorySearchOpen = false;
    }
}
