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
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, ContentElementI} from "../interfaces/spicepagebuilder.interfaces";

/** @ignore */
declare var _;

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelement.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public element: ContentElementI;
    /**
     * emit when delete button clicked
     */
    @Output() public delete$: EventEmitter<void> = new EventEmitter();
    /**
     * hold the edit mode boolean
     */
    @Input() public isEditMode: boolean = false;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'width', type: 'text'},
        {name: 'background-color', type: 'color'}
    ];
    /**
     * hold the style object for the element
     */
    private style = {};

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate body style from attributes
     */
    public ngOnInit() {
        this.generateStyle();
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.element.attributes = res.attributes;
        this.generateStyle();
        this.cdRef.detectChanges();
    }

    /**
     * generate body style object
     * @param pickList
     */
    public generateStyle(pickList?: string[]) {
        this.style = JSON.parse(JSON.stringify(!pickList ? this.element.attributes : _.pick(this.element.attributes, pickList)));
    }

    /**
     * set the hovered element level
     * @param value
     */
    private setIsMouseIn(value) {
        this.spicePageBuilderService.isMouseIn = value ? 'content' : 'section';
    }

    /**
     * set the current editing element
     */
    private edit() {
        this.modal.openModal('SpicePageBuilderEditor', true, this.injector).subscribe(modalRef => {
            modalRef.instance.element = JSON.parse(JSON.stringify(this.element));
            modalRef.instance.response.subscribe(res => {
                if (!!res) {
                    this.handleEditResponse(res);
                }
            });
        });
    }
}
