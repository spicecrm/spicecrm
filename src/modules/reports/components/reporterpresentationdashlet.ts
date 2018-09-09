import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-presentation-dashlet',
    templateUrl: './src/modules/reports/templates/reporterpresentationdashlet.html',
    providers: [model, reporterconfig],
    styles:[
        ':host {width:100%; height: 100%;}'
    ]
})
export class ReporterPresentationDashlet implements OnInit, AfterViewInit {
    @ViewChild('presentationcontainer', {read: ViewContainerRef}) presentationcontainer: ViewContainerRef;
    @Input() id: string = '';
    @Input() config: any = undefined;
    componentconfig: any = {};
    presComponent: any = undefined;

    constructor(private model: model, private metadata: metadata) {
    }

    ngOnInit() {
        //if config was passed in as inut use it
        if(this.config)
            this.componentconfig = this.config;
    }

    ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;
            if(this.componentconfig.parentBeanId && this.componentconfig.parentBeanModule) {
                this.model['parentBeanId'] = this.componentconfig.parentBeanId;
                this.model['parentBeanModule'] = this.componentconfig.parentBeanModule;
            }
            this.model.getData().subscribe(data => {
                this.renderPresentation();
            });
        }
    }

    renderPresentation() {
        if (this.presComponent) {
            this.presComponent.destroy();
            this.presComponent = undefined;
        }

        let presentationParams = JSON.parse(this.model.data.presentation_params);

        let presentationComponent = '';
        switch(presentationParams.plugin){
            case 'standard':
                presentationComponent = 'ReporterDetailPresentationStandard';
                break;

        }

        if(presentationComponent != '') {
            this.metadata.addComponent(presentationComponent, this.presentationcontainer).subscribe(componentRef => {
                // do not show a footer
                componentRef.instance.showFooter = false;
                this.presComponent = componentRef;
            });
        }
    }
}