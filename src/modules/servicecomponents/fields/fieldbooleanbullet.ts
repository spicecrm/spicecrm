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
    templateUrl: '../templates/fieldbooleanbullet.html',
})
export class fieldBooleanBullet extends fieldGeneric {
    // default class
    public colorTrueClass = 'slds-theme_success';
    public colorFalseClass = 'slds-color__background_gray-8';

    public bulletWidth = '0.875rem';
    public bulletHeight = '0.875rem';
    public bulletBorderRadius = '0.4375rem';

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super( model, view, language, metadata, router );
    }

    public getItemClass(){
        if(this.fieldconfig.classcolortrue) {
            this.colorTrueClass = this.fieldconfig.classcolortrue;
        }
        if(this.fieldconfig.classcolorfalse) {
            this.colorFalseClass = this.fieldconfig.classcolorfalse;
        }

        return {[this.colorFalseClass]: !this.value, [this.colorTrueClass]: this.value}
    }

    public getBulletStyle(){
        if(this.fieldconfig.width) {
            this.bulletWidth = this.fieldconfig.width;
        }
        if(this.fieldconfig.height) {
            this.bulletHeight = this.fieldconfig.height;
        }
        if(this.fieldconfig.borderradius) {
            this.bulletBorderRadius = this.fieldconfig.borderradius;
        }

        return {width: this.bulletWidth, height: this.bulletHeight, borderRadius: this.bulletBorderRadius}
    }

}
