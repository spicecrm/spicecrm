/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {scrum} from '../services/scrum.service';

@Component({
    selector: 'scrum-tree',
    templateUrl: './src/modules/scrum/templates/scrumtree.html'
})
export class ScrumTree {

    constructor(private scrum: scrum, private modellist: modellist) {

    }
    /**
     * faster loop
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

}
