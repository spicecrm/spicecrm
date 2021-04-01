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
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import {model} from '../../../services/model.service';
import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-visualization-dashlet',
    templateUrl: './src/modules/reports/templates/reportervisualizationdashlet.html',
    providers: [model, reporterconfig]
})
export class ReporterVisualizationDashlet implements OnInit, AfterViewInit {

    @Input() private id: string = '';
    @Input() private config: any = undefined;
    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    private componentconfig: any = {};
    private hasVisualization: boolean = false;
    private vizData: any = {};

    /**
     * emit if a no access or not found error has been raised by the backend
     * allows to hide the container for the report dashlet
     */
    @Output() private noAccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private model: model, private reporterconfig: reporterconfig) {
    }

    public ngOnInit() {
        if (this.config) {
            this.componentconfig = this.config;
        }
    }

    public ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;

            this.model.getData().subscribe(
                data => {
                    if (data.visualization_params != '') {
                        this.hasVisualization = true;
                    }
                },
                err => {
                    if (err.status == '403' || err.status == '404') {
                        this.noAccess.emit(true);
                    }
                });
        }
    }
}
