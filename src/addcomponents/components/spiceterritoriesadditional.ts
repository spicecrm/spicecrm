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
 * @module AddComponentsModule
 */
import {Component, ElementRef, ViewChild, ViewContainerRef, Input, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {territories} from '../../services/territories.service';

@Component({})
export class tfieldGeneric {
    @Input() private fieldname: string = '';
    @Input() private fieldconfig: any = {};
    private fieldid: string = '';
    private fielddisplayclass: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        this.fieldid = this.model.generateGuid();
    }

    private isEditable() {
        if (!this.view.isEditable || this.fieldconfig.readonly || (this.model.data && this.model.data.acl_fieldcontrol && this.model.data.acl_fieldcontrol[this.fieldname] && parseInt(this.model.data.acl_fieldcontrol[this.fieldname], 10) < 3)) {
            return false;
        } else {
            return true;
        }
    }

    private isEditMode() {
        if (this.view.isEditMode() && this.isEditable()) {
            return true;
        } else {
            return false;
        }
    }

    private displayLink() {
        try {
            return this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    private setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    private getFieldClass() {
        let classes: string[] = [];
        return classes;
    }

    private setFieldError(error) {
        // this.model.setFieldError(this.fieldname, error);
    }

    private getFieldError() {
        // return this.model.validityStatus[this.fieldname];
        // return this.model.getFieldError(this.fieldname);
    }

    private clearFieldError() {
        // this.model.clearFieldError(this.fieldname);
    }

    private fieldHasError() {
        // if (this.model.validityStatus[this.fieldname])
        //    return true;
        // else
        return false
    }

    private goRecord() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }
}


@Component({
    selector: 'spice-territorries-primary',
    templateUrl: './src/addcomponents/templates/spiceterritorriesprimary.html',
    providers: [popup],
    host: {
        // '(document:click)' : 'this.onClick($event)'
    }
})
export class SpiceTerritorriesPrimary extends tfieldGeneric {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    private clickListener: any;

    private relateSearchOpen: boolean = false;
    private objectsearchterm: string = '';

    private showPopover: boolean = false;
    private showPopoverTimeout: any = {};

    constructor(public model: model, public view: view, public popup: popup, public language: language, public metadata: metadata, public router: Router, private elementRef: ElementRef, private renderer: Renderer2, private territories: territories) {
        super(model, view, language, metadata, router);
        this.popup.closePopup$.subscribe(() => this.closePopups());
    }

    private getTerritorryName() {
        if (this.model.data.korgobjectmain) {
            return this.territories.getTerritoryName(this.model.module, this.model.data.korgobjectmain);
        } else {
            return '';
        }
    }

    private canRemove() {
        return this.territories.isUserTerritory(this.model.module, this.model.data.korgobjectmain);
    }

    private getTerritories() {
        let territories = [];
        for (let territory of this.territories.userTerritories[this.model.module]) {
            if (this.objectsearchterm === '' || (this.objectsearchterm !== '' && territory.name.toLowerCase().indexOf(this.objectsearchterm.toLowerCase()) !== -1)) {
                territories.push(territory);
            }
        }
        return territories;
    }

    private setTerritory(id) {
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

    private clearField() {
        this.model.data.korgobjectmain = '';
    }

    private onFocus() {
        this.relateSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private relateSearchStyle() {
        if (this.relateSearchOpen) {
            let rect = this.elementRef.nativeElement.getBoundingClientRect();
            return {
                width: rect.width + 'px',
                display: 'block'
            };
        }
    }


    /*
     * for the popover
     */
    private getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 15) + 'px',
            display: (this.showPopover ? '' : 'none')
        };
    }

    private getPopoverSide() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return rect.left < poprect.width ? 'right' : 'left';
    }

    private onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.showPopover = true, 500);
    }

    private onMouseOut() {
        if (this.showPopoverTimeout) window.clearTimeout(this.showPopoverTimeout);
        this.showPopover = false;
    }

}

@Component({
    selector: 'spice-territories-additional',
    templateUrl: './src/addcomponents/templates/spiceterritoriesadditional.html',
    providers: [popup],
    host: {
        // '(document:click)' : 'this.onClick($event)'
    }
})
export class SpiceTerritoriesAdditional extends tfieldGeneric {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) popover: ViewContainerRef;

    clickListener: any;

    territorySearchOpen: boolean = false;
    objectsearchterm: string = '';

    showPopover: boolean = false;
    showPopoverTimeout: any = {};

    searchObjects: boolean = false;

    constructor(public model: model, public view: view, public popup: popup, public language: language, public metadata: metadata, public router: Router, private elementRef: ElementRef, private renderer: Renderer2, private territories: territories) {
        super(model, view, language, metadata, router);
        this.popup.closePopup$.subscribe(() => this.closePopups());
    }

    getTerritoryName(territory) {
        return this.territories.getTerritoryName(this.model.module, territory);
    }

    getTerritorryNames() {
        let displayNames = [];
        if (this.model.data.korgobjectmultiple) {
            let territories = JSON.parse(this.model.data.korgobjectmultiple);

            for (let territory of territories.secondary) {
                displayNames.push(this.getTerritoryName(territory));
            }
        }
        return displayNames.join(', ');
    }

    getAdditonalTerritories() {
        let addTerritories = [];
        if (this.model.data.korgobjectmultiple) {
            let territories = JSON.parse(this.model.data.korgobjectmultiple);

            for (let territory of territories.secondary) {
                addTerritories.push({
                    id: territory,
                    name: this.getTerritoryName(territory)
                });
            }
        }
        return addTerritories;
    }

    getTerritories() {

        let territories = [];
        let objectTerritories: any = {
            primary: this.model.data.korgobjectmain,
            secondary: []
        }

        if (this.model.data.korgobjectmultiple !== '') {
            let objectTerritories = JSON.parse(this.model.data.korgobjectmultiple);
        }

        for (let territory of this.territories.userTerritories[this.model.module]) {
            if (objectTerritories.secondary.indexOf(territory.id) === -1 && territory.id !== objectTerritories.primary && (this.objectsearchterm === '' || (this.objectsearchterm !== '' && territory.name.toLowerCase().indexOf(this.objectsearchterm.toLowerCase()) !== -1))) {
                territories.push(territory);
            }
        }

        return territories;
    }

    addTerritory(territory: any) {
        let territories: any = {
            primary: this.model.data.korgobjectmain,
            secondary: []
        }

        if (this.model.data.korgobjectmultiple) {
            territories = JSON.parse(this.model.data.korgobjectmultiple);
        }

        territories.secondary.push(territory.id);
        this.model.data.korgobjectmultiple = JSON.stringify(territories);

        this.territorySearchOpen = false;
    }

    canRemove(territory) {
        return this.territories.isUserTerritory(this.model.module, territory);
    }

    startSearch() {
        this.searchObjects = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
            this.searchObjects = false;
            this.territorySearchOpen = false;
        }
    }

    private closePopups() {
        this.clickListener();

        if (this.model.data.korgobjectmain)
            this.objectsearchterm = '';

        this.searchObjects = false;
    }

    removeTerritory(id) {
        let territories = JSON.parse(this.model.data.korgobjectmultiple);
        territories.secondary.some((territorry, index) => {
            if (territorry === id) {
                territories.secondary.splice(index, 1);
                return true;
            }
        })

        this.model.data.korgobjectmultiple = JSON.stringify(territories);
    }

    onFocus() {
        this.territorySearchOpen = true;

    }

    relateSearchStyle() {
        if (this.territorySearchOpen) {
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
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 15) + 'px',
            display: (this.showPopover ? '' : 'none')
        };
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