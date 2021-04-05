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
import { Component, ElementRef, Input, ViewChild, OnInit  } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {relatedmodels} from '../../services/relatedmodels.service';
import {language} from '../../services/language.service';
import { model } from '../../services/model.service';
import { metadata } from '../../services/metadata.service';

/**
 * the header in the object-related-card
 *
 * displays the header with icon for the module, the title, the count and a open/close trigger, and also an actionset
 */
@Component({
    selector: 'object-related-card-header',
    templateUrl: './src/objectcomponents/templates/objectrelatedcardheader.html',
    animations: [
        trigger('animateicon', [
            state('open', style({ transform: 'scale(1, 1)'})),
            state('closed', style({ transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ])
    ],
})
export class ObjectRelatedCardHeader implements OnInit {

    /**
     * the component config as key paramater into the component
     */
    @Input() private componentconfig: any = {};

    /**
     * indicates if the panel is open ... this is checked fromt eh vcard to render the content or not
     */
    public isopen: boolean = true;

    /**
     * Reference to <ng-content></ngcontent>. Is needed in the template.
     */
    // @ViewChild('ngContent', {static:true}) private ngContent: ElementRef;

    constructor( private language: language, private relatedmodels: relatedmodels, private model: model, private metadata: metadata ) { }

    public ngOnInit(): void {
        if ( this.componentconfig.collapsed ) {
            // use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => this.isopen = !this.componentconfig.collapsed);
        }
    }

    /**
     * a getter for the Title to be displayed. This either translates a tilte if set int he config or it renders the module name
     */
    get panelTitle() {
        if ( this.componentconfig.title ) return this.language.getLabel( this.componentconfig.title );
        if ( this.relatedmodels._linkName && this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName] && this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName].vname ) {
            return this.language.getLabel( this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName].vname );
        }
        return this.language.getModuleName( this.module );
    }

    /**
     * a getter to extract the actionset from the componentconfig
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * a getter to extract the module from the componentconfig
     */
    get module() {
        return this.componentconfig.object;
    }

    /**
     * toggle Open or Close the panel
     */
    private toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isopen = !this.isopen;
    }

    /**
     * triggers the reload of the related models service
     */
    private reload() {
        this.relatedmodels.getData();
    }

}
