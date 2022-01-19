/**
 * @module ModuleScrum
 */
import {Component, Input, SkipSelf, EventEmitter, Output} from '@angular/core';

import {model} from '../../../services/model.service';



@Component({
    selector: 'scrum-tree-additem',
    templateUrl: '../templates/scrumtreeadditem.html',
    providers: [model],
})
export class ScrumTreeAddItem {

    @Input() public title: string = '';

    /**
     * input for the module
     */
    @Input() public module: string = '';

    /**
     * emitter of the new item
     */
    @Output() public newitem: EventEmitter<any> = new EventEmitter<any>();

    constructor(@SkipSelf() public parent: model, public model: model) {
    }


    /**
     * add child-item to parent, subscribe to model observable and emit change
     */
    public addItem() {
        this.model.id = undefined;
        this.model.module = this.module;
        this.model.addModel('', this.parent).subscribe(
            item => {
                this.newitem.emit(item);
            }
        );
    }



}
