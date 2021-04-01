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
 * @module SystemComponents
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    EventEmitter,
    AfterViewInit,
    Input,
    Output,
    OnChanges, SimpleChanges
} from '@angular/core';
import {metadata} from '../../services/metadata.service';

/**
 * renders a container with a dynamic component rendered therein
 */
@Component({
    selector: 'system-dynamic-component',
    templateUrl: './src/systemcomponents/templates/systemdynamiccomponent.html'
})
export class SystemDynamicComponent implements AfterViewInit, OnChanges {

    /**
     * the reference to the container in the template
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * the component to be rendered
     */
    @Input() private component: string = '';

    /**
     * the componentconfig
     */
    @Input() private componentconfig: any;

    /**
     * componentparameters to be set to the instance
     */
    @Input() private componentattributes: any;

    /**
     * the componentref that is created. The component will emit that
     */
    @Output() private componentref: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the component that is rendered
     */
    private _component: any;

    /**
     *
     */
    private initialized: boolean = false;

    constructor(private metadata: metadata) {
    }

    /**
     * after view init add the component via the metadata service
     */
    public ngAfterViewInit() {
        if (!this.initialized) {
            this.renderComponent();
        }
    }

    /**
     * react to changes
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.container && changes.component) {
            if (this._component) {
                this._component.destroy();
                this._component = undefined;
            }
            this.renderComponent();

            this.initialized = true;

        }
    }

    private renderComponent() {
        if (this.component) {
            this.metadata.addComponent(this.component, this.container).subscribe(componentref => {
                this.componentref.emit(componentref);

                // if we have the componetconfig .. add it
                if (this.componentconfig) {
                    componentref.instance.componentconfig = this.componentconfig;
                }

                // set additonal attributes
                if (this.componentattributes) {
                    for (let attrib in this.componentattributes) {
                        componentref.instance[attrib] = this.componentattributes[attrib];
                    }
                }

                this._component = componentref;
            });
        }
    }
}
