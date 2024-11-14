/**
 * @module ModuleACLTerritories
 */
import {Component, ElementRef, Renderer2, OnInit, Injector, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {territories} from "../../../services/territories.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'field-territory',
    templateUrl: '../templates/fieldterritory.html'
})
export class fieldTerritory extends fieldGeneric implements OnInit, OnDestroy {

    /**
     * click lisatener to haneld the open Popup
     */
    public clickListener: any;

    /**
     * set to true if the search popup is open
     */
    public territorySearchOpen: boolean = false;

    /**
     * the search term entered
     */
    public territorySearchTerm: string = '';

    public t: any[] = [];

    public fieldconfig: any;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public elementRef: ElementRef, public renderer: Renderer2, public modal: modal, public territories: territories, public injector: Injector) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {

        this.t = this.territories.userTerritories[this.model.module];

        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);

        // if we have a new model determine a default territory
        if (this.model.isNew) {
            let searchterritories = this.territories.searchTerritories(this.model.module, '', undefined, [], 'create');
            if (searchterritories.length == 1) {
                this.value = searchterritories[0].id;
                this.model.setField(this.fieldname + '_name', searchterritories[0].name);
            } else if(searchterritories.length > 1 && this.fieldconfig.prompt) {
                this.modal.prompt('input', undefined, 'LBL_SELECT_TERRITORY', 'shade', searchterritories[0].id, searchterritories.map(t => { return {value: t.id, display: t.name}})).subscribe({
                    next: (val) => {
                        if(val) {
                            this.value = searchterritories[0].id;
                            this.model.setField(this.fieldname + '_name', searchterritories.find(t => t.id == val).name);
                        }
                    }
                })
            }
        }
    }

    public ngOnDestroy(): void {
        if (this.clickListener) this.clickListener();
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    public closePopups() {
        this.clickListener();

        if (this.value) {
            this.territorySearchTerm = '';
        }

        this.territorySearchOpen = false;
    }

    public clearField() {
        this.value = '';
    }

    public onFocus() {
        this.territorySearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    get territoryName() {
        return this.model.getFieldValue(this.fieldname + '_name');
    }

    public setTerritory(territory) {
        this.territorySearchOpen = false;
        this.territorySearchTerm = '';
        this.value = territory.id;
        this.model.setField(this.fieldname + '_name', territory.name);
    }

    public openSearchModal() {
        this.territorySearchOpen = false;
        this.modal.openModal('fieldTerritorySearchModal', true, this.injector).subscribe(selectModal => {
            selectModal.instance.searchTerm = this.territorySearchTerm;
            selectModal.instance.selectedTerritory.subscribe(territory => {
                this.value = territory.id;
                this.model.setField(this.fieldname + '_name', territory.name);
                this.territorySearchTerm = '';
            });
        });
    }
}
