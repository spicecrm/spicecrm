/**
 * @module ModuleService
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';
import {Router} from '@angular/router';
import {view} from '../../../services/view.service';

declare var moment: any;

/**
 * renders a bullet, indicating the existence of product warranty
 */
@Component({
    templateUrl: './src/modules/servicecomponents/templates/fieldwarrantyindicator.html',
})
export class fieldWarrantyIndicator extends fieldGeneric {

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super( model, view, language, metadata, router );
    }

    get hasWarranty(): boolean {
        return this.value.isSameOrAfter( moment(), 'day');
    }

}
