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
 * @module ModuleSalesDocs
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'field-salesdoc-types',
    templateUrl: './src/modules/salesdocs/templates/fieldsalesdoctypes.html'
})
export class fieldSalesdocTypes extends fieldGeneric {

    public options: any[] = [];

    /**
     * Keep the language subscription the unsubscribe at component end.
     */
    private languageSubscription: Subscription = new Subscription();

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configuration: configurationService) {
        super(model, view, language, metadata, router);
        // Keep the language subscription the unsubscribe at component end:
        this.languageSubscription = this.language.currentlanguage$.subscribe( () => this.translateAndSortOptions() );
    }

    public ngOnInit() {
        super.ngOnInit();

        this.getOptions();
    }

    public getValue(): string {
        try {
            if (!this.value) return '';

            // find the option and try to translate the table
            let thisOption = this.options.find(itemtype => itemtype.name == this.value);
            if (thisOption && thisOption.vname) {
                return this.language.getLabel(thisOption.vname);
            } else {
                return this.value;
            }
        } catch (e) {
            return this.value;
        }
    }

    /**
     * loads the salesdoc types from the config
     *
     * if config setting without display only is set filter the document out that are display ony .. this is required for the creation of sales documents
     */
    public getOptions() {
        let salesdocTypes = this.configuration.getData('salesdoctypes');
        if ( _.isArray( salesdocTypes )) {
            if( this.fieldconfig.withoutdisplayonly ) {
                this.options = salesdocTypes.filter( salesdocType => salesdocType.displayonly == 0 );
            } else {
                this.options = salesdocTypes;
            }
            this.translateAndSortOptions();
        }
    }

    /**
     * translates (and sorts) the salesdocstypes
     */
    public translateAndSortOptions() {
        this.options.forEach( option => option.vnameTrans = this.language.getLabel(option.vname));
        this.language.sortObjects( this.options, 'vnameTrans');
    }

    /**
     * Unsubscribe from language service.
     */
    public ngOnDestroy() {
        this.languageSubscription.unsubscribe();
    }

}
