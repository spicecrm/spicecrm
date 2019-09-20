/**
 * @module ModuleReports
 */
import {
    Component,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-detilview',
    templateUrl: './src/modules/reports/templates/reporterdetailview.html',
    providers: [model, reporterconfig]
})
export class ReporterDetailView implements OnDestroy {

    @ViewChild('presentationcontainer', {read: ViewContainerRef, static: true}) private presentationcontainer: ViewContainerRef;
    @ViewChild('presentationview', {read: ViewContainerRef, static: true}) private presentationview: ViewContainerRef;
    @ViewChild('pageheader', {read: ViewContainerRef, static: true}) private pageheader: ViewContainerRef;



    private routeSubscribe: any = {}
    private id: string = '';
    private vizData: any = {};
    private presComponent: any = undefined;
    private hasVisualization: boolean = false;
    private whereConditions: any = {};
    private integrationParams: any = {};

    private showFilters: boolean = false;

    constructor(private broadcast: broadcast, private language: language, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation, private reporterconfig: reporterconfig) {
        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            this.model.module = 'KReports';
            this.model.id = this.id;
            this.model.getData(true, 'detailview').subscribe(data => {
                this.navigation.setActiveModule('KReports', this.model.id, data.summary_text);
                if (data.visualization_params != '') {
                    this.hasVisualization = true;
                }

                // load the where conditions
                this.reporterconfig.resetUserFilters();
                this.whereConditions = JSON.parse(data.whereconditions);

                // render the presentation
                this.renderPresentation();

                // handle plugins
                if (data.integration_params != '')
                    this.integrationParams = JSON.parse(data.integration_params);

            });
        });
    }


    public ngOnDestroy() {
        this.routeSubscribe.unsubscribe();
    }

    get presentationStyle() {
        if (this.presentationcontainer && this.presentationcontainer.element.nativeElement.getBoundingClientRect()) {
            let rect = this.presentationcontainer.element.nativeElement.getBoundingClientRect();
            return {
                height: 'calc(100vh - ' + rect.top + 'px)',
                overflow: 'hidden'
            }
        }
    }

    showPlugin(plugin) {
        return this.integrationParams.activePlugins && this.integrationParams.activePlugins[plugin];
    }

    private getVisualization() {

        this.backend.getRequest('KReporter/' + this.id + '/visualization').subscribe(vizData => {
            this.vizData = vizData;
        })
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
            case 'grouped':
                presentationComponent = 'ReporterDetailPresentationGrouped';
                break;
            case 'standardws':
                presentationComponent = 'ReporterDetailPresentationStandardWS';
                break;

        }

        if (presentationComponent != '') {
            this.metadata.addComponent(presentationComponent, this.presentationview).subscribe(componentRef => {
                this.presComponent = componentRef;
            });
        }
    }

    /*
     * for the filter pnale handling
     */
    private toggleFilters(event) {
        this.showFilters = event;
    }

    get filterPanelStyle() {
        let rect = this.pageheader.element.nativeElement.getBoundingClientRect();
        return {
            right: '0px',
            top: rect.bottom + 'px',
            height: 'calc(100vh - ' + rect.bottom + 'px)'
        }
    }

}