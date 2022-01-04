/**
 * @module ModuleScrum
 */
import {Component} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {scrum} from '../services/scrum.service';

@Component({
    selector: 'scrum-tree',
    templateUrl: '../templates/scrumtree.html'
})
export class ScrumTree {

    constructor(public scrum: scrum, public modellist: modellist) {

    }
    /**
     * faster loop
     */
    public trackbyfn(index, item) {
        return item.id;
    }

}
