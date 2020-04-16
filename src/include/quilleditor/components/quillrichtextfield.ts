/**
 * @module ObjectFields
 */
import {ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'quill-rich-text-field',
    templateUrl: './src/include/quilleditor/templates/quillrichtextfield.html'
})
export class QuillRichTextField extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public zone: NgZone,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }
}
