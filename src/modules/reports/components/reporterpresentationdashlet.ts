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
 * @module ModuleReports
 */
import {
    Component,
    Input,
    AfterViewInit,
    Output,
    EventEmitter,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-presentation-dashlet',
    templateUrl: './src/modules/reports/templates/reporterpresentationdashlet.html',
    providers: [model, reporterconfig],
    styles: [
        ':host {width:100%; height: 100%;}'
    ]
})
export class ReporterPresentationDashlet implements AfterViewInit {
    /**
     * rewference to the contaioner that will hold the presentation component
     */
    @ViewChild('presentationcontainer', {
        read: ViewContainerRef,
        static: true
    }) private presentationcontainer: ViewContainerRef;

    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    @Input() private displayheader: boolean = true;

    @Input() private componentconfig: any = {};

    /**
     * emites the title after the report is loaded
     */
    @Output() private dashletTitle: EventEmitter<string> = new EventEmitter<string>();

    private presComponent: any = undefined;

    /**
     * emit if a no access or not found error has been raised by the backend
     * allows to hide the container for the report dashlet
     */
    @Output() private noAccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private model: model, private metadata: metadata, private elementRef: ElementRef) {
    }

    public ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;
            if (this.parentId && this.parentModule) {
                this.model['parentBeanId'] = this.parentId;
                this.model['parentBeanModule'] = this.parentModule;
            }
            this.model.getData().subscribe(
                data => {
                    // emit the title
                    this.dashletTitle.emit(this.model.getField('name'));

                    // render the report
                    this.renderPresentation();
                },
                err => {
                    if (err.status == '403' || err.status == '404') {
                        this.noAccess.emit(true);
                    }
                });
        }
    }

    /**
     * calculates the offset of the header and sets the proper style so the presentation conatiner has a defined height to fit in
     */
    get containerstyle() {
        let presrect = this.presentationcontainer.element.nativeElement.getBoundingClientRect();

        return {
            height: "calc(100% - " + this.presentationcontainer.element.nativeElement.offsetTop + 'px)'
        };

    }

    /**
     * opens the report
     */
    private openReport() {
        this.model.goDetail();
    }

    /**
     * renders the presentation
     */
    private renderPresentation() {
        if (this.presComponent) {
            this.presComponent.destroy();
            this.presComponent = undefined;
        }

        let presentationParams = this.model.data.presentation_params;

        let presentationComponent = '';
        switch (presentationParams.plugin) {
            case 'standard':
                presentationComponent = 'ReporterDetailPresentationStandard';
                break;
            case 'grouped':
                presentationComponent = 'ReporterDetailPresentationGrouped';
                break;
            case 'standardws':
                presentationComponent = 'ReporterDetailPresentationStandardWS';
                break;
            case 'tree':
                presentationComponent = 'ReporterDetailPresentationTree';
                break;
            case 'pivot':
                presentationComponent = 'ReporterDetailPresentationPivot';
                break;

        }

        if (presentationComponent != '') {
            this.metadata.addComponent(presentationComponent, this.presentationcontainer).subscribe(componentRef => {
                // do not show a footer
                componentRef.instance.showFooter = false;
                this.presComponent = componentRef;
            });
        }
    }
}
