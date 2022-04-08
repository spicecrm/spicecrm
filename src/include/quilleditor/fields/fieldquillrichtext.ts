/**
 * @module QuillEditorModule
 */

import {ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'field-quill-rich-text',
    templateUrl: '../templates/fieldquillrichtext.html'
})
export class fieldQuillRichText extends fieldGeneric implements OnInit {

    /**
     * hold internal height value
     */
    public heightStyle: string = '300px';

    constructor(public model: model,
                public view: view,
                public language: language,
                public zone: NgZone,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * call to set the height style
     */
    public ngOnInit() {
        this.setHeightStyle();
    }

    /**
     * set editor height
     */
    public setHeightStyle() {
        this.heightStyle = !isNaN(parseInt(this.fieldconfig.height, 10)) ? parseInt(this.fieldconfig.height, 10) + 'px' : '300px';
    }
}
