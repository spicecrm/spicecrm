import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * created by Sebastian Franz
 */
@Component({
    selector: 'field-model-info',
    templateUrl: './app/objectfields/templates/fieldmodelinfo.html'
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