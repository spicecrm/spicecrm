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

@Component({
    selector: 'workflow-taks-dashlet',
    templateUrl: './src/modules/workflow/templates/workflowtasksdashlet.html',
    providers: [model],
    styles:[
        ':host {width:100%; height: 100%;}'
    ]
})
export class WorkflowTasksDashlet {

    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) itemcontainer: ViewContainerRef;

    workflowtasks: Array<any> = [];

    constructor(private model: model, private modelutilities: modelutilities, private backend: backend, private language: language, private elementref: ElementRef) {
        this.workflowtasks = [];
        this.backend.getRequest('Workflows/mytasks').subscribe(wftasks => {
            for(let wftask of wftasks) {
                this.workflowtasks.push(this.modelutilities.backendModel2spice('WorkflowTasks', wftask));
            }
        })
    }

    goDetail(object, id){
        this.model.module = object;
        this.model.id = id;
        this.model.goDetail();
    }


    get containerStyle(){
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.itemcontainer.element.nativeElement.offsetTop + 'px)'
        }
    }


}