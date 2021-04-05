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
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

/**
 * renders a vertical tab continer item
 */
@Component({
    selector: 'object-vertical-tab-container-item',
    templateUrl: './src/objectcomponents/templates/objectverticaltabcontaineritem.html',
    providers: [fielderrorgrouping]
})
export class ObjectVerticalTabContainerItem implements OnInit, AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    // initialized: boolean = false;

    /**
     * the componentset to be rendered in the tab
     */
    @Input() private componentset: string;

    /**
     * errors on the tabs
     */
    @Output() private taberrors = new EventEmitter();

    constructor(private metadata: metadata, private fielderrorgroup: fielderrorgrouping ) {
    }

    /**
     * set th etab group for the erro handling if ields are on multiple tabs
     */
    public ngOnInit() {
        this.fielderrorgroup.change$.subscribe( (nr) => {
            this.taberrors.emit( nr );
        });
    }

    /**
     * build the container after the view is rendered
     */
    public ngAfterViewInit() {
        // this.initialized = true;
        for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(component.component, this.container).subscribe(componentRef => {
                componentRef.instance.componentconfig = component.componentconfig;
            });
        }
    }
}
