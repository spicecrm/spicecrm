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
 * @module ObjectFields
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';
import {Router} from "@angular/router";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {model} from "../../services/model.service";

/**
 * renders an icon based on the module filter match/mismatch if defined, otherwise renders the default icon
 */
@Component({
    selector: 'field-icon-condition',
    templateUrl: './src/objectfields/templates/fieldiconcondition.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class fieldIconCondition extends fieldGeneric {
    /**
     * holds the timeout for the setter to be handled
     */
    public setterTimeout: number;
    /**
     * holds the icon name to be rendered
     */
    public icon: string;
    /**
     * holds the title label to be rendered
     */
    public label: string;
    /**
     * holds the color class to be rendered
     */
    public colorClass: 'slds-icon-text-default'|'slds-icon-text-success'|'slds-icon-text-warning'|'slds-icon-text-error'|'slds-icon-text-light' | string = 'slds-icon-text-default';
    /**
     * holds the field config set in the fieldset configuration
     */
    @Input() public fieldconfig: {
        modulefilter?: string,
        icon?: string,
        label?: string,
        size?: 'large' | 'small' | 'x-small' | 'xx-small',
        colorTheme?: 'default' | 'success' | 'warning' | 'error' | 'light',
        matchIcon?: string,
        matchLabel?: string,
        matchColorTheme?: 'default' | 'success' | 'warning' | 'error' | 'light',
        mismatchIcon?: string,
        mismatchLabel?: string,
        mismatchColorTheme?: 'default' | 'success' | 'warning' | 'error' | 'light',
    } = {};

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public backend: backend,
                public router: Router,
                private cdRef: ChangeDetectorRef) {
        super(model, view, language, metadata, router);
        this.subscriptions.add(
            this.subscribeToModelChanges()
        );
    }

    public ngAfterViewChecked() {
        console.log('checked');
    }

    /**
     * call the initialize on the parent and set the local values
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setValues();
    }

    /**
     * subscribe to model data changes the call set values
     * @private
     */
    private subscribeToModelChanges() {
        return this.model.data$.subscribe(() => {
            this.setValues();
        });
    }

    /**
     * set the icon, the color class and the label based on the module filter match
     * @private
     */
    private setValues() {

        window.clearTimeout(this.setterTimeout);

        this.setterTimeout = window.setTimeout(() => {

                if (!this.fieldconfig.modulefilter) {
                    this.icon = this.fieldconfig.icon;
                    this.label = this.fieldconfig.label;
                    if (!!this.fieldconfig.colorTheme) {
                        this.colorClass = 'slds-icon-text-' + this.fieldconfig.colorTheme;
                    }
                } else if (this.model.checkModuleFilterMatch(this.fieldconfig.modulefilter)) {
                    this.icon = this.fieldconfig.matchIcon;
                    this.label = this.fieldconfig.matchLabel;
                    if (!!this.fieldconfig.matchColorTheme) {
                        this.colorClass = 'slds-icon-text-' + this.fieldconfig.matchColorTheme;
                    }
                } else {
                    this.icon = this.fieldconfig.mismatchIcon;
                    this.label = this.fieldconfig.mismatchLabel;
                    if (!!this.fieldconfig.mismatchColorTheme) {
                        this.colorClass = 'slds-icon-text-' + this.fieldconfig.mismatchColorTheme;
                    }
                }
                this.cdRef.detectChanges();
            },
            1000
        );
    }
}
