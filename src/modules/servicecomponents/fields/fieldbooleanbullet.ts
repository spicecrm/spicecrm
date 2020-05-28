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

/**
 * renders a bullet, in slds success color or grey, depending on the boolean value of the field
 */
@Component({
    templateUrl: './src/modules/servicecomponents/templates/fieldbooleanbullet.html',
})
export class fieldBooleanBullet extends fieldGeneric {

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super( model, view, language, metadata, router );
    }

}
