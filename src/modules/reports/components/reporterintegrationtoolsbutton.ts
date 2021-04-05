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
 * @module ModuleReports
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

/**
 * buttons group to render the report integration tools plugin action items
 */
@Component({
    selector: 'reporter-integration-tools-button',
    templateUrl: './src/modules/reports/templates/reporterintegrationtoolsbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterIntegrationToolsButton implements OnChanges, AfterViewInit {
    /**
     * container reference to render the action items inside
     */
    @ViewChild('actionItemsContainer', {
        read: ViewContainerRef,
        static: false
    }) private actionItemsContainer: ViewContainerRef;
    /**
     * integration params of the report to handle the plugins
     */
    @Input() private integrationParams: any = {};
    /**
     * to save the action component references
     */
    private actionComponentRefs: any[] = [];

    constructor(private language: language,
                private metadata: metadata) {
    }

    /**
     * return disabled if there is no active plugins or user has no permission to export
     */
    get isDisabled() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                if (!this.integrationParams.activePlugins.hasOwnProperty(plugin)) continue;
                switch (plugin) {
                    case 'kqueryanalizer':
                        if (this.integrationParams.activePlugins.kqueryanalizer == 1) return false;
                }
            }
        }

        return true;
    }

    /**
     * render the action items
     */
    public ngOnChanges() {
        this.renderActionItems();
    }

    /**
     * render the action items
     */
    public ngAfterViewInit() {
        this.renderActionItems();
    }

    /**
     * rerender the action items and push the component reference to array
     */
    private renderActionItems() {
        this.actionComponentRefs.forEach(ref => ref.destroy());
        this.actionComponentRefs = [];

        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                if (!this.integrationParams.activePlugins.hasOwnProperty(plugin)) continue;

                switch (plugin) {
                    case 'kqueryanalizer':
                        if (this.integrationParams.activePlugins.kqueryanalizer == 1) {
                            this.metadata.addComponent('ReporterIntegrationQueryanalyzerButton', this.actionItemsContainer).subscribe(object => {
                                this.actionComponentRefs.push(object);
                            });
                        }
                        break;
                }
            }
        }

    }
}
