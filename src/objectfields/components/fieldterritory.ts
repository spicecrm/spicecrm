import {Component, ElementRef, Renderer, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {fts} from "../../services/fts.service";
import {popup} from "../../services/popup.service";
import {territories} from "../../services/territories.service";

@Component({
    selector: 'field-territory',
    templateUrl: './src/objectfields/templates/fieldterritory.html'
})
export class fieldTerritory extends fieldGeneric implements OnInit {

    clickListener: any;

    territorySearchOpen: boolean = false;
    territorySearchTerm: string = '';


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private elementRef: ElementRef, private renderer: Renderer, private modal: modal, private territories: territories) {
        super(model, view, language, metadata, router);
    }

    ngOnInit() {
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

        if (this.value)
            this.territorySearchTerm = '';

        this.territorySearchOpen = false;

    }

    clearField() {
        this.value = '';
    }

    onFocus() {
        this.territorySearchOpen = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }


    get territoryName(){
        return this.model.getFieldValue(this.fieldname +'_name');
    }

    setTerritory(territory) {
        this.territorySearchOpen = false;
        this.territorySearchTerm = '';
        this.value = territory.id;
        this.model.setField(this.fieldname +'_name', territory.name);
    }

    openSearchModal() {
        // close the relate search
        this.territorySearchOpen = false;
        this.clickListener();

        /*
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if(items.length > 0) {
                    this.model.data[this.relateIdField] = items[0].id;
                    this.model.data[this.relateNameField] = items[0].summary_text;
                }
            });
        });
        */
    }

}