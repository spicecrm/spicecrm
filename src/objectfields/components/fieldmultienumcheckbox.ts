import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-multienum-checkbox',
    templateUrl: './app/objectfields/templates/fieldmultienumcheckbox.html'
})
export class fieldMultienumCheckBox {

    @Input() fieldname = '';
    @Input() option: any = '';
    @Input() disabled: boolean = false;
    fieldid: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata) {
        this.fieldid = this.model.generateGuid();
    }

    getValueArray(): Array<any> {
        if (this.model.data[this.fieldname])
            return this.model.data[this.fieldname].substring(1, this.model.data[this.fieldname].length - 1).split('^,^');
        else
            return [];
    }

    get checked() {
        if (this.model.data[this.fieldname]) {
            let checked = false;
            if (this.model.data[this.fieldname] == this.option.value) checked = true;
            if (this.model.data[this.fieldname].indexOf('^' + this.option.value + '^') > -1) checked = true;
            return checked;
        }
        else
            return false;
    }


    set checked(value) {

        let valArray = this.getValueArray();

        let valIndex = valArray.indexOf(this.option.value);
        if (valIndex === -1) {
            valArray.push(this.option.value);
        } else {
            valArray.splice(valIndex, 1);
        }

        this.model.data[this.fieldname] = '^' + valArray.join('^,^') + '^';
    }
}