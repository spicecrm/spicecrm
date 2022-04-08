/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-enum',
    templateUrl: '../templates/fieldcolorenum.html'
})
export class fieldColorEnum  extends fieldGeneric {

    public longOptions: any = [];
    public options: any = [];
    public colors: any = [];
    public acolor: any = {'background-color': ''};


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.getOptions();
    }

    public getOptions() {
        this.longOptions = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        let options = this.longOptions;

        if(!options || this.fieldconfig.useShort) {
            options = this.language.getDisplayOptions(this.fieldconfig.shortEnum);
        }

        this.colors = this.language.getDisplayOptions(this.fieldconfig.colorEnum);
        if(typeof this.colors !== 'undefined') {
            let colordef = '';
            colordef = this.colors[this.value];
            if (typeof colordef !== 'undefined') {
                if (colordef.substring(0, 1) != '#') {
                    colordef = '#' + colordef;
                }
            }
            this.acolor['background-color'] = colordef;
        }
        let retArray = [];
        for (let optionVal in options) {
            let arrcolor = (typeof this.colors !== 'undefined' && typeof this.colors[optionVal] !== 'undefined') ? (this.colors[optionVal].substring(0, 1) != '#' ? '#' + this.colors[optionVal] : this.colors[optionVal] ): '';
            let arrlong = (typeof this.longOptions !== 'undefined') ? this.longOptions[optionVal] : '';
            retArray.push({
                value: optionVal,
                color: arrcolor,
                display: options[optionVal],
                long: arrlong
            });
        }
        this.options = retArray;
    }

    get getColor() {
        let colordef = '';
        if (typeof this.colors != 'undefined') {
            colordef = this.colors[this.value];
            if(colordef) {
                if (colordef.substring(0, 1) != '#') {
                    colordef = '#' + colordef;
                }
            }
            this.acolor['background-color'] = colordef;
        }
        return this.acolor;
    }

    public getValue(): string {
        for (let opt of this.options) {
            if (opt.value == this.value) {
                return opt.display;
            }
        }
    }

    public changed() {
        let colordef = '';
        colordef = this.colors[this.value];
        if (typeof colordef !== 'undefined') {
            if(colordef.substring(0, 1) != '#') {
                colordef = '#' + colordef;
            }
        }
        this.acolor['background-color'] = colordef;
    }
}
