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
import {Component, Input, OnInit, Output} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {navigationtab} from '../../services/navigationtab.service';
import {Router} from '@angular/router';

/**
 * the footer in the object-related-card
 *
 * This triggers a view all button that navigates to the view all route and also a refresh button to reload the list
 */
@Component({
    selector: 'object-related-card-footer',
    templateUrl: './src/objectcomponents/templates/objectrelatedcardfooter.html'
})
export class ObjectRelatedCardFooter implements OnInit {

    /**
     * the component config as key paramater into the component
     */
    @Input() private componentconfig;

    /**
     * @ignore
     *
     * the module of the card: set in ngOnInit from the config
     */
    private module: string = '';

    /**
     * @ignore
     *
     * the fieldset of the card: set in ngOnInit from the config. This is used to feed the related model route
     */
    private fieldset: string = undefined;

    /**
     * qignore
     *
     * currently not used .. to be implemented to allow showing more record
     */
    private _displayitems = 5;

    /**
     * internal guid to issue an id and name for the radiogroup to select the list size
     */
    private componentid: string;

    /**
     * indicates that we are paginating and the service is loading
     *
     * @private
     */
    public paginating: boolean = false;

    constructor(private language: language, private relatedmodels: relatedmodels, private model: model, private router: Router, private navigationtab: navigationtab) {
        this.componentid = this.model.utils.generateGuid();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.fieldset = this.componentconfig.fieldset;
        this.module = this.componentconfig.object;
    }

    /**
     * @ignore
     *
     * getter for the items to be displayed
     *
     * ToDo: add logic for setting that by the user
     */
    get displayitems() {
        return this._displayitems;
    }

    /**
     * @ignore
     *
     * setter for the items to be displayed
     *
     * ToDo: add logic for setting that by the user
     */
    set displayitems(items) {
        if (items !== this.displayitems) {
            this.displayitems = items;
            this.relatedmodels.loaditems = items;
            this.relatedmodels.getData();
        }
    }

    /**
     * a helper to check if the view All button shoudl be displayed or not
     */
    get canViewAll() {
        return this.relatedmodels.count > 0 && this.relatedmodels.count > this.relatedmodels.items.length; // this.relatedmodels.items.length;
    }

    private canSetCount() {
        return this.relatedmodels.count > this.relatedmodels.items.length;
    }

    /**
     * navigates to the route to show all related mndels
     */
    private showAll() {
        let routePrefix = '';
        if (this.navigationtab?.tabid) {
            routePrefix = '/tab/' + this.navigationtab.tabid;
        }

        if (this.fieldset && this.fieldset != '') {
            this.router.navigate([routePrefix + '/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName + '/' + this.fieldset]);
        } else {
            this.router.navigate([routePrefix + '/module/' + this.model.module + '/' + this.model.id + '/' + this.relatedmodels.relatedModule + '/' + this.relatedmodels._linkName]);
        }
    }

    /**
     * triggers the reload of the related models service
     */
    private reload() {
        this.relatedmodels.offset = 0;
        this.paginating = true;
        this.relatedmodels.getData().subscribe(() => this.paginating = false);
    }

    /**
     * getter if the next button should be disabled
     */
    get nextDisabled() {
        return this.relatedmodels.offset + this.relatedmodels.loaditems >= this.relatedmodels.count;
    }

    /**
     * navigate one page forward
     *
     * @private
     */
    private nextPage() {
        if (!this.nextDisabled) {
            this.relatedmodels.offset = this.relatedmodels.offset + this.relatedmodels.loaditems;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * navigate to the last page
     *
     * @private
     */
    private lastPage() {
        if (!this.nextDisabled) {
            let lastOffset = Math.floor(this.relatedmodels.count / this.relatedmodels.loaditems) * this.relatedmodels.loaditems;
            this.relatedmodels.offset = lastOffset;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * getter if the previous and first buttons sh9udl be disabled
     */
    get previousDisabled() {
        return this.relatedmodels.offset == 0;
    }

    /**
     * navigate to the previous page
     *
     * @private
     */
    private previousPage() {
        if (!this.previousDisabled) {
            this.relatedmodels.offset = this.relatedmodels.offset - this.relatedmodels.loaditems;
            if (this.relatedmodels.offset < 0) this.relatedmodels.offset = 0;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * navigate to the first page
     *
     * @private
     */
    private firstPage() {
        if (!this.previousDisabled) {
            this.relatedmodels.offset = 0;
            this.paginating = true;
            this.relatedmodels.getData(true).subscribe(() => this.paginating = false);
        }
    }

    /**
     * gets the current page number
     */
    get page() {
        return this.relatedmodels.offset / this.relatedmodels.loaditems + 1;
    }

    /**
     * gets the total number of pages
     */
    get pages() {
        return Math.floor(this.relatedmodels.count / this.relatedmodels.loaditems) + 1;
    }
}
