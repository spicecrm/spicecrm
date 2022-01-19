/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {configurationService} from "../../services/configuration.service";

declare var _;

@Component({
    selector: 'field-textid',
    templateUrl: '../templates/fieldtextid.html'
})
export class fieldTextID extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public configurationService: configurationService,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    get textName() {
        let sysTextIds = this.configurationService.getData('systextids');
        let text = sysTextIds ? sysTextIds[this.value] : undefined;
        return text && text.label ? this.language.getLabel(text.label) : this.value;
    }
}
