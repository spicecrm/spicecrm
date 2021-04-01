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
import {Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {layout} from '../../../services/layout.service';

import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'media-file-picker',
    templateUrl: './src/modules/mediafiles/templates/mediafilepicker.html',
    providers: [view, modellist, model]
})
export class MediaFilePicker extends ObjectModalModuleLookup {

    /**
     * set the module fixed to MediaFiles
     */
    public module = 'MediaFiles';

    /**
     * event emitter for the response
     */
    @Output() private answer: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout, private elementRef: ElementRef) {
        super(language, modellist, metadata, modelutilities, model, layout);
    }

    /**
     * gets the padding for the tiles container
     */
    get containerStyle() {
        let bbox = this.elementRef.nativeElement.getBoundingClientRect();
        let count = Math.floor((bbox.width - 10) / 320);
        let padding = Math.floor(((bbox.width - 10) - count * 320) / 2);
        return {
            'padding-left': padding + 'px',
            'padding-right': padding + 'px'
        };
    }

    /**
     * delibvers the pick event if an image is picked
     *
     * @param item
     */
    private pick(item): void {
        this.answer.emit({id: item});
        this.self.destroy();
    }

    /**
     * adds a new model
     */
    private upload(): void {
        if (!this.metadata.checkModuleAcl('edit')) {
            return;
        }
        this.model.module = 'MediaFiles';
        this.model.id = undefined;
        this.model.initialize();
        this.model.addModel().subscribe(data => {
            this.answer.emit({id: this.model.id});
            this.self.destroy();
        });
    }

}
