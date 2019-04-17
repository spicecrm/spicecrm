/**
 * @module ObjectComponents
 */

import {
    Component,
    ElementRef,
OnInit
} from '@angular/core';
import {ActivatedRoute, Router}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';


@Component({
    selector: 'object-page-header-details',
    templateUrl: './src/objectcomponents/templates/objectpageheaderdetails.html',

})
export class ObjectPageHeaderDetails implements OnInit{
    componentconfig: any = {};

    constructor(private elementref: ElementRef, private activatedRoute: ActivatedRoute, private router: Router, private model: model, private metadata: metadata) {

    }

    ngOnInit(){
        if(JSON.stringify(this.componentconfig) == '{}')
            this.componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);
    }

    get fieldSets(){
        return this.componentconfig && this.componentconfig.fieldset ? [this.componentconfig.fieldset] : [];
    }

    get collapsed(){
        return this.componentconfig.collapsed ? this.componentconfig.collapsed : false;
    }

}