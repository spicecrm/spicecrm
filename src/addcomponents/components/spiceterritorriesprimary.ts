/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module AddComponentsModule
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {territories} from '../../services/territories.service';
import {fieldGeneric} from '../../objectfields/components/fieldgeneric';

@Component({
    selector: 'spice-territorries-primary',
    templateUrl: './src/addcomponents/templates/spiceterritorriesprimary.html',
    providers: [popup],
    host: {
        // '(document:click)' : 'this.onClick($event)'
    }
})
export class SpiceTerritorriesPrimary extends fieldGeneric {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) popover: ViewContainerRef;

    clickListener: any;

    relateSearchOpen: boolean = false;
    objectsearchterm: string = '';

    showPopover: boolean = false;
    showPopoverTimeout: any = {};

    constructor(public model: model, public view: view, public popup: popup, public language: language, public metadata: metadata, public router: Router, private elementRef: ElementRef, private renderer: Renderer2, private territories: territories) {
        super(model, view, language, metadata, router);
        this.popup.closePopup$.subscribe(() => this.closePopups());
    }

    getTerritorryName() {
        if (this.model.data.korgobjectmain)
            return this.territories.getTerritoryName(this.model.module, this.model.data.korgobjectmain);
        else
            return '';
    }

    canRemove() {
        return this.territories.isUserTerritory(this.model.module, this.model.data.korgobjectmain);
    }

    getTerritories() {
        let territories = [];
        for (let territory of this.territories.userTerritories[this.model.module]) {
            if (this.objectsearchterm === '' || (this.objectsearchterm !== '' && territory.name.toLowerCase().indexOf(this.objectsearchterm.toLowerCase()) !== -1))
                territories.push(territory);
        }
        return territories;
    }

    setTerritory(id) {
        this.model.data.korgobjectmain = id;
        this.closePopups();
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        this.clickListener();

        if (this.model.data.korgobjectmain)
            this.objectsearchterm = '';

        this.relateSearchOpen = false;
    }

    clearField() {
        this.model.data.korgobjectmain = '';
    }

    onFocus() {
        this.relateSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    relateSearchStyle() {
        if (this.relateSearchOpen) {
            let rect = this.elementRef.nativeElement.getBoundingClientRect();
            return {
                width: rect.width + 'px',
                display: 'block'
            }
        }
    }


    /*
     * for the popover
     */
    getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ( (rect.height - poprect.height) / 2 )) + 'px',
            left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 15) + 'px',
            display: (this.showPopover ? '' : 'none')
        }
    }

    getPopoverSide() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return rect.left < poprect.width ? 'right' : 'left';
    }

    onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.showPopover = true, 500);
        //this.showPopover = true;
    }

    onMouseOut() {
        if (this.showPopoverTimeout) window.clearTimeout(this.showPopoverTimeout);
        this.showPopover = false;
    }

}
