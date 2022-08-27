/**
 * @module ModuleOrgunits
 */
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, SkipSelf, ViewChild} from '@angular/core';
import {orgunitsViewService} from "../services/orgunitsview.service";
import {model} from "../../../services/model.service";


/**
 * a modal in the orgchart to offer selection of add Options
 */
@Component({
    selector: 'orgunits-chart-view-box-add-options',
    templateUrl: '../templates/orgunitschartviewboxaddoptions.html'
})
export class OrgunitsChartViewBoxAddOptions {

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any;

    /**
     * the option selected
     */
    public option: string = 'addorgunit';

    /**
     * an emitter for the selected option
     */
    public selection: EventEmitter<string> = new EventEmitter<string>();

    /**
     * closes the modal
     */
    public close(){
        this.self.destroy();
    }

    /**
     * closes the modal
     */
    public add(){
        this.selection.emit(this.option);
        this.self.destroy();
    }
}
