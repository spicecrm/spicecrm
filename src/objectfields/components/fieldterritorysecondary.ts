import {Component, Renderer2, ViewChild, ViewContainerRef, ElementRef, OnInit, Pipe} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {territories} from '../../services/territories.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Pipe({
    name: 'fieldterritorysecondarypipe',
    pure: false
})
export class fieldTerritorySecondaryPipe {

    transform(territories, primary_territory_id) {
        let retValues = [];

        for (let territory of territories)
            if(territory.id != primary_territory_id)
            retValues.push(territory);

        return retValues;
    }
}


@Component({
    templateUrl: './app/objectfields/templates/fieldterritorysecondary.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldTerritorySecondary extends fieldGeneric {

    isAdding: boolean = false;
    //territories: Array<any> = [];
    territorySearchOpen: boolean = false;
    territorySearchTerm: string = '';
    clickListener: any;
    currentHash = '';

    @ViewChild('addAddressInput', {read: ViewContainerRef}) addAddressInput: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private renderer: Renderer2, private elementRef: ElementRef, private territoriesService: territories) {
        super(model, view, language, metadata, router);

    }

    get primary_territory_id(){
        return this.model.getFieldValue('spiceacl_primary_territory');
    }

    get territories(){
        try {
            return JSON.parse(this.model.data.spiceacl_secondary_territories)
        } catch(e){
            return [];
        }
    }

    set territories(value){
        this.model.data.spiceacl_secondary_territories = JSON.stringify(value ? value : []);
    }

    private onClick() {
        this.isAdding = true;
    }

    private onBlur() {
        if (this.territorySearchTerm == '')
            this.isAdding = false;
    }

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
        })
        this.territories = territories;

    }


    closeSearchDialog() {
        // close the cliklistener sine the component is gone
        this.clickListener();
        this.territorySearchOpen = false;
    }

    private handleClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchDialog();
            this.territorySearchTerm = '';
            this.isAdding = false;
        }
    }

    private addTerritory(territory) {
        let territories = this.territories;
        if(territories == '') territories = [];
        territories.push(territory);
        this.territories = territories;
        this.territorySearchTerm = '';
        this.isAdding = false;

    }

    territoryName(territoryId) {
        return this.territoriesService.getTerritoryName(this.model.module, territoryId);
    }
}
