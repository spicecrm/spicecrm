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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    Renderer2,
    OnDestroy,
    ViewChild,
    ViewContainerRef, Input
} from '@angular/core';

import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';
import {modellist} from '../../../services/modellist.service';
import {ObjectList} from "../../../objectcomponents/components/objectlist";

/**
 * renders the media File List
 */
@Component({
    selector: 'media-files-list',
    templateUrl: './src/modules/mediafiles/templates/mediafileslist.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaFilesList extends ObjectList implements OnDestroy {

    /**
     * a handler to catch the resizte event and recalculate the padding
     */
    private resizeHandler: any;

    constructor(public router: Router, public cdRef: ChangeDetectorRef, public metadata: metadata, public modellist: modellist, public language: language, public layout: layout, private renderer: Renderer2, private elementRef: ElementRef) {
        super(router, cdRef, metadata, modellist, language, layout);

        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.onResize());
    }

    public ngOnDestroy() {
        super.ngOnDestroy();

        this.resizeHandler();
    }

    private onResize() {
        this.cdRef.detectChanges();
    }

    get containerStyle() {
        let bbox = this.elementRef.nativeElement.getBoundingClientRect();
        let count = Math.floor((bbox.width - 10) / 320);
        let padding = Math.floor(((bbox.width - 10) - count * 320) / 2);
        return {
            'padding-left': padding + 'px',
            'padding-right': padding + 'px'
        };
    }

}
