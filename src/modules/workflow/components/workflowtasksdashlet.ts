/**
 * @module ModuleWorkflow
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';

/**
 * renders a dashlet with open Workflow Tasks for the user
 */
@Component({
    selector: 'workflow-taks-dashlet',
    templateUrl: '../templates/workflowtasksdashlet.html',
    providers: [model],
    styles: [
        ':host {width:100%; height: 100%;}'
    ]
})
export class WorkflowTasksDashlet {

    /**
     * the container refgerence .. for the setting of the dimensions
     */
    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) public itemcontainer: ViewContainerRef;

    /**
     * the tzasks to be rendered
     */
    public workflowtasks: any[] = [];

    constructor(public model: model, public modelutilities: modelutilities, public backend: backend, public language: language, public elementref: ElementRef) {
        this.workflowtasks = [];
        this.backend.getRequest('module/Workflows/mytasks').subscribe(wftasks => {
            for (let wftask of wftasks) {
                this.workflowtasks.push(this.modelutilities.backendModel2spice('WorkflowTasks', wftask));
            }
        });
    }


    /**
     * gets and sets the style for the dashlet
     */
    get containerStyle() {
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.itemcontainer.element.nativeElement.offsetTop + 'px)'
        };
    }
}
