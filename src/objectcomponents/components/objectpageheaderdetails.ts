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
    templateUrl: './src/objectcomponents/templates/objectpageheaderdetails.html',

})
export class ObjectPageHeaderDetails implements OnInit {
    /**
     * the componenntconfig loaded from the top of retrieved for the module
     */
    public componentconfig: any = {};

    private collapsed: boolean = false;

    private fieldset: string;

    constructor(private elementref: ElementRef, private activatedRoute: ActivatedRoute, private router: Router, private model: model, private metadata: metadata) {

    }

    public ngOnInit() {
        if (JSON.stringify(this.componentconfig) == '{}') {
            this.componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);

            this.collapsed = this.componentconfig.collapsed ? this.componentconfig.collapsed : false;

            this.fieldset = this.componentconfig.fieldset ? this.componentconfig.fieldset : '';
        }
    }

}
