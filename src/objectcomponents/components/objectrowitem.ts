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
import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';



@Component({
    selector: '[object-row-item]',
    templateUrl: './src/objectcomponents/templates/objectrowitem.html',
    providers: [model, view],
})
/**
 *  a component which represents a row in a table with dynamic model data and fields/tds to display
 *  no need of any provided model oder modellist services...
 */
export class ObjectRowItemComponent implements OnInit
{
    @Input('rowselection') rowselect:boolean = false;
    @Input('fields') listFields:Array<any> = [];
    @Input('itemdata') listItem:any = {};
    @Input() module:string;
    @Input() inlineedit:boolean = false;

    // input param to determine if theaction menu is shown for the model
    @Input() showActionMenu:boolean = true;

    @Input('selected')
    @HostBinding('class.slds-is-active')
    @HostBinding('class.slds-is-selected')
    private _selected:boolean = false;

    @Output() select = new EventEmitter();

    constructor(
        private model: model,
        private view: view,
        private router: Router,
        private language: language
    ) {

    }

    ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.listItem.id;
        this.model.data = this.listItem;

        this.view.isEditable = this.inlineedit && this.model.data.acl.edit;
    }

    set selected(val:boolean)
    {
        this._selected = val;
        this.select.emit(val);
    }

    get selected():boolean
    {
        return this._selected;
    }

    navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

}