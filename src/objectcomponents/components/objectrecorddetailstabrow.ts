/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectComponents
 */

import { OnInit, ComponentFactoryResolver, Component, Input} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-record-details-tab-row',
    templateUrl: './src/objectcomponents/templates/objectrecorddetailstabrow.html'
})
export class ObjectRecordDetailsTabRow implements OnInit {
    // @ViewChild('fieldsetcontainer', {read: ViewContainerRef, static: true}) fieldsetcontainer: ViewContainerRef;

    initialized: boolean = false;
    componentconfig: any = {}
    componentRefs: any[] = [];
    rowFields: Array<any> = [];

    @Input() fieldset: string = '';

    constructor(private activatedRoute: ActivatedRoute, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model) {
        //if (this.initialized)
        //    this.buildContainer();
    }

    /*
    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }
    */

    ngOnInit(){
        this.rowFields = this.metadata.getFieldSetFields(this.fieldset['fieldset']);
    }

    getFieldSizeClass(){
        return 'slds-size--1-of-'+this.rowFields.length;
    }

    getFieldWidth(){
        return {
            width: Math.round(1 / this.rowFields.length * 100) + '%'
        }
    }

    showLabel(fieldConfig){
        if(fieldConfig.hidelabel === true)
            return false;
        else
            return true;
    }
}