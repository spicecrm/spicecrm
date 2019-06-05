/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef
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
export class ReporterPresentationDashlet implements OnInit, AfterViewInit {
    @ViewChild('presentationcontainer', {read: ViewContainerRef}) private presentationcontainer: ViewContainerRef;
    @Input() private id: string = '';
    @Input() private config: any = undefined;

    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    @Input() private displayheader: boolean = true;

    private componentconfig: any = {};
    private presComponent: any = undefined;

    constructor(private model: model, private metadata: metadata) {
    }

    public ngOnInit() {
        // if config was passed in as inut use it
        if (this.config) {
            this.componentconfig = this.config;
        }
    }

    public ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;
            if (this.parentId && this.parentModule) {
                this.model['parentBeanId'] = this.parentId;
                this.model['parentBeanModule'] = this.parentModule;
            }
            this.model.getData().subscribe(data => {
                this.renderPresentation();
            });
        }
    }

    private renderPresentation() {
        if (this.presComponent) {
            this.presComponent.destroy();
            this.presComponent = undefined;
        }

        let presentationParams = JSON.parse(this.model.data.presentation_params);

        let presentationComponent = '';
        switch (presentationParams.plugin) {
            case 'standard':
                presentationComponent = 'ReporterDetailPresentationStandard';
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