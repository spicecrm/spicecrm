/**
 * @module ModuleScrum
 */
import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {scrumtree} from '../services/scrum.service';

@Component({
    selector: 'scrumtree',
    templateUrl: './src/modules/scrum/templates/scrumtree.html'
})
export class ScrumTree  {

    constructor(private scrum: scrumtree, private model: model, private metadata: metadata, private modellist: modellist) {

    }
    /**
     * faster loop
     */
    protected trackbyfn(index, item) {
        return item.id;
    }
}
