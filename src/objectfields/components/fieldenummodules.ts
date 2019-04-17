/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldEnum} from "./fieldenum";

@Component({
    selector: 'field-enum-modules',
    templateUrl: './src/objectfields/templates/fieldenum.html'
})
export class FieldEnumModulesComponent extends fieldEnum {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    public getValue(): string {
        return this.language.getModuleName(this.value, true);
    }

    public ngOnInit() {
        this.getOptions();
    }

    public getOptions() {
        let options = this.metadata.getModules();
        for (let opt of options) {
            this.options.push({
                value: opt,
                display: this.language.getModuleName(opt, true),
            });
        }
        this.options.sort((a, b) => {
            return a.display > b.display ? 1 : -1;
        });

        // set the first value if no value is set and we are in edit mode
        if (this.isEditMode() && this.options.length > 0 && !this.value) {
            this.value = this.options[0].value;
        }
    }
}
