/**
 * @module ObjectComponents
 */

import {
    Component,
    ElementRef,
    OnInit
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';


@Component({
    selector: 'object-page-header-details',
    templateUrl: '../templates/objectpageheaderdetails.html',

})
export class ObjectPageHeaderDetails implements OnInit {
    /**
     * the componenntconfig loaded from the top of retrieved for the module
     */
    public componentconfig: any = {};

    public collapsed: boolean = false;

    public fieldset: string;

    constructor(public elementref: ElementRef, public activatedRoute: ActivatedRoute, public router: Router, public model: model, public metadata: metadata) {

    }

    public ngOnInit() {
        if (JSON.stringify(this.componentconfig) == '{}') {
            this.componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);

            this.collapsed = this.componentconfig.collapsed ? this.componentconfig.collapsed : false;

            this.fieldset = this.componentconfig.fieldset ? this.componentconfig.fieldset : '';
        }
    }

}
