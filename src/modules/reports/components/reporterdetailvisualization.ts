import {
    Component, Input, AfterViewInit, OnInit,
    OnDestroy, ViewChild, ViewContainerRef
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'reporter-detail-visualization',
    templateUrl: './app/modules/reports/templates/reporterdetailvisualization.html'
})
export class ReporterDetailVisualization implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('vizcontainer', {read: ViewContainerRef}) vizcontainer: ViewContainerRef;

    loading: boolean = true;
    vizData: any = {};

    constructor(private broadcast: broadcast, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation) {

    }

    handleMessage(message: any) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.getVisualization()
    }

    ngOnDestroy() {

    }

    getVisualization() {

        let params: any = {};
        if (this.model['parentBeanId'] && this.model['parentBeanModule']) {
            params.parentbeanId = this.model['parentBeanId'];
            params.parentbeanModule = this.model['parentBeanModule'];
        }

        this.backend.getRequest('KReporter/' + this.model.id + '/visualization', params).subscribe(vizData => {
            this.vizData = vizData;
            this.loading = false;
            this.renderVisualization();
        })
    }

    renderVisualization() {
        for (let visualization of this.vizData) {
            let visComponent = '';
            switch (visualization.plugin) {
                case 'highcharts':
                    visComponent = 'ReporterDetailVisualizationHighcharts';
                    break;
                case 'googlecharts':
                    visComponent = 'ReporterDetailVisualizationGooglecharts';
                    break;
            }
            if (visComponent != '')
                this.metadata.addComponent(visComponent, this.vizcontainer).subscribe(componentRef => {
                    componentRef.instance['vizdata'] = visualization;
                })
        }
    }
}