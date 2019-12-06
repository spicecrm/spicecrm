/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'reporter-visualization-container',
    templateUrl: './src/modules/reports/templates/reportervisualizationcontainer.html',
    styles: [
        ':host {width:100%; height: 300px;}'
    ]
})
export class ReporterVisualizationContainer {

    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * status to have the component hidden
     */
    private isHidden: boolean = false;

    constructor(private model: model) {
    }

    /**
     * called when the container canot load the report
     * @param event
     */
    private noAccess(event) {
        this.isHidden = event;
    }

}
