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
 * @module ObjectComponents
 */
import {
    Component, EventEmitter,
    Input, Output,
} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: '[object-table-row]',
    templateUrl: './src/objectcomponents/templates/objecttablerow.html',
    providers: [view],
    host: {
        'class': 'slds-hint-parent',
    }
})
export class ObjectTableRow
{
    @Input() public fields = [];
    @Input() public selected = false;
    @Output('select') public select$ = new EventEmitter();
    @Output('unselect') public unselect$ = new EventEmitter();
    private selectable: boolean = false;
    @Input('selectable') public attr_selectable: string;

    constructor(
        private language: language,
        private model: model,
        private view: view,
    ) {
        this.view.isEditable = false;

        // hide labels
        this.view.displayLabels = false;
    }

    public ngOnInit()
    {
        // cause of attribute binding doesn't work when using attr.selectable I have to use it as @Input... and read it only one time here...
        this.selectable = this.attr_selectable !== null;
    }

    public toggleSelection()
    {
        if(!this.selectable) {
            return false;
        }

        this.selected = !this.selected;
        if(this.selected) {
            this.select$.emit(this.model.data);
        } else {
            this.unselect$.emit(this.model.data);
        }
    }

}
