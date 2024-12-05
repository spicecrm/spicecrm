/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {EnumDisplayOptionArray, language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: '../templates/fieldenum.html'
})
export class fieldEnum extends fieldGeneric {

    public options: EnumDisplayOptionArray = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

        this.subscriptions.add(
            this.language.currentlanguage$.subscribe((language) => {
                this.getOptions();
            })
        );
    }

    public ngOnInit() {
        super.ngOnInit();

        this.getOptions();
    }

    public getValue(): string {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    public getOptions() {

        this.options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname, true, true);

        if (this.fieldconfig.sortdirection) {
            switch (this.fieldconfig.sortdirection.toLowerCase()) {
                case 'desc':
                    this.options.sort((a,b) => a.display.toLowerCase() < b.display.toLowerCase() ? 1 : -1);
                    break;
                case 'asc':
                    this.options.sort((a,b) => a.display.toLowerCase() > b.display.toLowerCase() ? 1 : -1);
            }
        }
    }
}
