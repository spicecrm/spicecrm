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
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {ListTypeI} from "../../services/interfaces.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'object-list-types',
    templateUrl: './src/objectcomponents/templates/objectlisttypes.html'
})
export class ObjectListTypes {
    /**
     * holds the list types
     */
    public listTypes: ListTypeI[] = [];
    private subscription = new Subscription();

    constructor(private modellist: modellist, private elementRef: ElementRef, private renderer: Renderer2, private language: language) {
        this.initialize();
    }

    /**
     * disable if there can onlybe one list selected
     */
    get disabled() {
        return this.modellist.isLoading || (this.modellist.standardLists.length + this.listTypes.length <= 1);
    }

    /**
     * load the list types and subscribe to list type changes
     * @private
     */
    private initialize() {
        this.setListTypes();
        this.subscription = this.modellist.listType$.subscribe(() => {
            this.setListTypes();
        });
    }

    private setListTypes() {
        this.listTypes = this.modellist.getListTypes(false)
            .map(type => ({...type, icon: type.global && type.global != '0' ? 'world' : 'user'}))
            .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    }

    private showMenu: boolean = false;

    private setListType(id = 'all') {
        this.modellist.setListType(id);
        this.showMenu = false;
    }

    /**
     * for handling the simle dorpdowntrigger
     *
     * @param event
     */
    public onClick(event: MouseEvent): void {
        if (!event.target) {
            return;
        }

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showMenu = false;
        }
    }

    /**
     * returns a list type icon indicating if this is a peronal or a global list
     *
     * @param listtype
     */
    private getListtypeIcon(listtype) {
        return listtype.global && listtype.global != '0' ? 'world' : 'user';
    }

}
