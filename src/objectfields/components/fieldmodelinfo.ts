/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * display an info icon and then renders a model popover
 */
@Component({
    selector: 'field-model-info',
    templateUrl: '../templates/fieldmodelinfo.html'
})
export class FieldModelInfoComponent
{
    constructor(
        public model:model,
        public language:language,
    )
    {

    }

}
