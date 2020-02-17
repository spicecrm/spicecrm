/**
 * @module ModuleScrum
 */
import {Component, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'scrumtree',
    templateUrl: './src/modules/scrum/templates/scrumtree.html',
})
export class ScrumTree {
    @Output() private selectedobject: EventEmitter<string> = new EventEmitter<string>();

    private focus: string = '';

    constructor(private model: model, private metadata: metadata, private modellist: modellist) {

    }

    protected trackbyfn(index, item) {
        return item.id;
    }

    private selectComponent(id) {
        this.focus = id;
        this.selectedobject.emit(id);
    }
}
