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
    templateUrl: './src/modules/workflow/templates/workflowtasksdashlet.html',
    providers: [model],
    styles: [
        ':host {width:100%; height: 100%;}'
    ]
})
export class WorkflowTasksDashlet {

    /**
     * the container refgerence .. for the setting of the dimensions
     */
    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) private itemcontainer: ViewContainerRef;

    /**
     * the tzasks to be rendered
     */
    private workflowtasks: any[] = [];

    constructor(private model: model, private modelutilities: modelutilities, private backend: backend, private language: language, private elementref: ElementRef) {
        this.workflowtasks = [];
        this.backend.getRequest('Workflows/mytasks').subscribe(wftasks => {
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