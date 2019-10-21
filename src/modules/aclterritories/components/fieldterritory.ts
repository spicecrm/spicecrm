/**
 * @module ModuleACLTerritories
 */
import {Component, ElementRef, Renderer, OnInit, Injector} from '@angular/core';
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
    templateUrl: './src/modules/aclterritories/templates/fieldterritory.html'
})
export class fieldTerritory extends fieldGeneric implements OnInit {

    /**
     * click lisatener to haneld the open Popup
     */
    private clickListener: any;

    /**
     * set to true if the search popup is open
     */
    private territorySearchOpen: boolean = false;

    /**
     * the search term entered
     */
    private territorySearchTerm: string = '';


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private elementRef: ElementRef, private renderer: Renderer, private modal: modal, private territories: territories, private injector: Injector) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        this.clickListener();

        if (this.value) {
            this.territorySearchTerm = '';
        }

        this.territorySearchOpen = false;
    }

    private clearField() {
        this.value = '';
    }

    private onFocus() {
        this.territorySearchOpen = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    get territoryName() {
        return this.model.getFieldValue(this.fieldname + '_name');
    }

    private setTerritory(territory) {
        this.territorySearchOpen = false;
        this.territorySearchTerm = '';
        this.value = territory.id;
        this.model.setField(this.fieldname + '_name', territory.name);
    }

    private openSearchModal() {
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
