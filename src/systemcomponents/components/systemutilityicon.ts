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
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output, SimpleChanges
} from '@angular/core';

/**
 * an icon rendered from the utility sprite
 */
@Component({
    selector: 'system-utility-icon',
    templateUrl: './src/systemcomponents/templates/systemutilityicon.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUtilityIcon implements OnChanges{
    /**
     * the name of the icon to be rendered
     *
     * - it can be a simple name of an icon .. then it is rendered as a utility icon
     * - it can be a string sepoarated with the sprite and the icon. e.g. 'standard:decision' then the sprite is taken form the icon
     *  - it can hold sprite, icon and size override. e.g. 'standard:decision:medium'
     *
     */
    @Input() private icon: string = '';

    /**
     * the size of the icon
     */
    @Input() private size: 'large' | 'small' | 'x-small' | 'xx-small' = 'small';

    /**
     * a string of classes that can be passed in and is added to the SVG
     */
    @Input() private addclasses: string = '';

    /**
     * an optional color class: can be any of the avialable SLDS icon color classes
     */
    @Input() private colorclass: 'slds-icon-text-default'|'slds-icon-text-success'|'slds-icon-text-warning'|'slds-icon-text-error'|'slds-icon-text-light' = 'slds-icon-text-default';

    /**
     * a string for the title that is rendered as part of the SVG HTML element
     */
    @Input() private title: string = '';

    /**
     * emits the click event
     */
    @Output() private click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    constructor(private cdref: ChangeDetectorRef) {

    }


    /**
     * run detect changes in teh onCHnage Lifecycle event
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.cdref.detectChanges();
    }

    /**
     * returns the SVG href
     */
    private getSvgHRef() {
        return './vendor/sldassets/icons/' + this._sprite + '-sprite/svg/symbols.svg#' + this._icon;
    }

    /**
     * retuns the icon class for the ngClass in the template
     */
    private getIconClass() {
        return 'slds-icon  slds-icon--' + this._size + ' ' + this.colorclass + ' ' + this.addclasses;

    }

    /**
     * handles the icon .. if there is a ':' in the icon name the first part is the sprite .. the second is the icon
     */
    get _icon() {
        if (this.icon && this.icon.indexOf(':') > 0) {
            return this.icon.split(':')[1];
        } else {
            return this.icon;
        }
    }

    /**
     * handles the sprite .. if there is a ':' in the icon name the first part is the sprite .. default is utility
     */
    get _sprite() {
        if (this.icon && this.icon.indexOf(':') > 0) {
            return this.icon.split(':')[0];
        } else {
            return 'utility';
        }
    }

    /**
     * handles the sprite .. if there is a ':' in the icon name the first part is the sprite .. default is utility
     */
    get _size() {
        if (this.icon && this.icon.indexOf(':') > 0 && this.icon.split(':').length > 2) {
            return this.icon.split(':')[2];
        }

        return this.size ? this.size : 'small';

    }
}
