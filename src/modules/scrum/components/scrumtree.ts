/**
 * @module ModuleScrum
 */
import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {scrum} from '../services/scrum.service';

@Component({
    selector: 'scrumtree',
    templateUrl: './src/modules/scrum/templates/scrumtree.html',
    providers: [scrum]
})
export class ScrumTree implements OnInit {
    // @Output() private selectedobject: EventEmitter<string> = new EventEmitter<string>();

    private selectedobject: string;
    private focus: string = '';

    constructor(private scrum: scrum, private model: model, private metadata: metadata, private modellist: modellist) {

    }
    public ngOnInit(): void {
        this.scrum.currentid.subscribe(selectedObjID => this.selectedobject = selectedObjID);
    }
    protected trackbyfn(index, item) {
        return item.id;
    }

    private selectComponent(id) {
        this.focus = id;
        this.scrum.selectedID(id);
    }
}
