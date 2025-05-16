/**
 * @module ModuleReports
 */
import {
    Component, Input
} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'reporter-visualization-container',
    templateUrl: '../templates/reportervisualizationcontainer.html',
    styles: [
        ':host {width:100%; height: 300px;}'
    ]
})
export class ReporterVisualizationContainer {

    /**
     * the component config
     */
    @Input() public componentconfig: any = {};

    /**
     * status to have the component hidden
     */
    public isHidden: boolean = false;

    constructor(public model: model) {
    }

    /**
     * called when the container canot load the report
     * @param event
     */
    public noAccess(event) {
        this.isHidden = event;
    }

}
