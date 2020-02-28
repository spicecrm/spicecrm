/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {scrum} from '../services/scrum.service';

@Component({
    selector: 'scrum-tree',
    templateUrl: './src/modules/scrum/templates/scrumtree.html'
})
export class ScrumTree {

    constructor(private scrum: scrum, private model: model, private metadata: metadata, private modellist: modellist) {

    }
    /**
     * faster loop
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

}
