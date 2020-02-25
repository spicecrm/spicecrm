/**
 * @module ModuleScrum
 */
import {Component, Input, Injector, SkipSelf} from '@angular/core';

import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';


@Component({
    selector: 'scrum-tree-additem',
    templateUrl: './src/modules/scrum/templates/scrumtreeadditem.html',
    providers: [model],
})
export class ScrumTreeAddItem {

    /**
     * input for the module
     */
    @Input() private module: string = '';


    constructor(@SkipSelf() private parent: model,  private language: language, private model: model) {
    }


    /**
     * add child-item to parent
     */
    private addItem() {
        this.model.module = this.module;
        this.model.addModel('', this.parent);
    }
}
