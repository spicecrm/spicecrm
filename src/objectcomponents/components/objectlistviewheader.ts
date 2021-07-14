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
import {Component, Input} from '@angular/core';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {configurationService} from '../../services/configuration.service';
import {animate, style, transition, trigger} from "@angular/animations";

/**
 * renders the default header for a listview of a module
 */
@Component({
    selector: 'object-listview-header',
    templateUrl: './src/objectcomponents/templates/objectlistviewheader.html',
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectListViewHeader {
    /**
     * the actionset to be rendered
     */
    private actionSet: any = {};

    /**
     * the search timeout triggered by the keyup in the search box
     */
    private searchTimeOut: any;

    /**
     * indicates if the entered searchterms woudl provoke any error
     * dues to the min and max engram restrictions and thus
     * would certainly not pfind any results
     * @private
     */
    private searchTermError: boolean = false;

    constructor(
        private metadata: metadata,
        private configuration: configurationService,
        private modellist: modellist,
        private language: language,
        private model: model
    ) {
        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    set searchTerm(value: string) {
        if (value != this.modellist.searchTerm) {
            this.modellist.searchTerm = value;
            if(value == '' || this.searchTermsValid(value)) {
                this.searchTermError = false;
                this.reloadList();
            } else {
                // if we have a timeout set .. clear it
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                // set the error
                this.searchTermError = true;
            }
        }
    }

    get searchTerm(): string {
        return this.modellist.searchTerm;
    }

    /**
     * checks if we have the proper length of searchterms
     *
     * @param searchTerm
     * @private
     */
    private searchTermsValid(searchTerm) {
        let config = this.configuration.getCapabilityConfig('search');
        let minNgram = config.min_ngram ? parseInt(config.min_ngram, 10) : 3;
        let maxNgram = config.max_ngram ? parseInt(config.max_ngram, 10) : 20;
        let items = searchTerm.split(' ');
        return items.filter(i => i.length < minNgram || i.length > maxNgram).length == 0;
    }

    /**
     * clears the searchterm
     * @private
     */
    private clearSearchTerm() {
        this.searchTerm = '';
    }

    /**
     * reload the model list on 1 second timeout
     * @private
     */
    private reloadList() {
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
        this.searchTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 1000);
    }
}
