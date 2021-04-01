/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/aclterritories/templates/fieldterritory.html'
})
export class fieldTerritory extends fieldGeneric implements OnInit, OnDestroy {

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


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private elementRef: ElementRef, private renderer: Renderer2, private modal: modal, private territories: territories, private injector: Injector) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);

        // if we have a new model determine a default territory
        if (this.model.isNew) {
            let searchterritories = this.territories.searchTerritories(this.model.module, '', 2, [], 'create');
            if (searchterritories.length == 1) {
                this.value = searchterritories[0].id;
                this.model.setField(this.fieldname + '_name', searchterritories[0].name);
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
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
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
