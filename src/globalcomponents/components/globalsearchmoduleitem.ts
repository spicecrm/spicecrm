/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module GlobalComponents
 */
import {ElementRef, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {layout} from '../../services/layout.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {model} from '../../services/model.service';

@Component({
    selector: '[global-search-module-item]',
    templateUrl: './src/globalcomponents/templates/globalsearchmoduleitem.html',
    providers: [view, model]
})
export class GlobalSearchModuleItem implements OnInit {
    @Input() private module: string = '';
    @Input() private listfields: string = '';
    @Input() private listitem: any = {};

    private expanded: boolean = false;

    constructor(private elementref: ElementRef, private router: Router, private view: view, private model: model, private language: language, private layout: layout) {
        this.view.isEditable = false;
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        // backwards compatibility with elasic 6 and still supporting elastic 7
        this.model.module = this.listitem._type == '_doc' ?  this.listitem._source._module : this.listitem._type;

        this.model.id = this.listitem._id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.listitem._source);
        this.model.data.acl = this.listitem.acl;
        this.model.data.acl_fieldcontrol = this.listitem.acl_fieldcontrol;

        // add acl so the links work as well
        this.model.data.acl = this.listitem.acl;
    }

    private navigateDetail(event) {
        // stop the click here
        event.stopPropagation();

        // see if we can navigate
        if (this.model.data.acl.detail) {
            this.model.goDetail();
        }
    }

    private toggleexpanded() {
        this.expanded = !this.expanded;
    }

    get isexpanded() {
        return this.layout.screenwidth != 'small' || this.expanded;
    }

    get expandicon() {
        return this.expanded ? 'chevronup' : 'chevrondown';
    }
}
