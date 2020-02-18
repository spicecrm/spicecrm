/**
 * @module ModuleScrum
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit, OnChanges
} from '@angular/core';

import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {scrum} from '../services/scrum.service';

@Component({
    selector: 'scrum-tree-node',
    templateUrl: './src/modules/scrum/templates/scrumtreenode.html',
    providers: [model, scrum]
})
export class ScrumTreeNode implements OnInit {
    // @Output() private selectedobject: EventEmitter<string> = new EventEmitter<string>();

    private selectedobject: string;

    @Input() private theme: any = {};

    @Input() private focus: string = '';

    private epics: any[] = [];
    private expanded: boolean = false;

    constructor(private scrum: scrum, private language: language, private metadata: metadata, private model: model) {
    }

    public ngOnInit() {
        this.model.module = 'ScrumThemes';
        this.model.initialize();
        this.model.id = this.theme.id;
        this.model.data = this.theme;
        this.scrum.currentid.subscribe(selectedObjID => this.selectedobject = selectedObjID);
    }

    private loadRelatedEpics() {
        this.epics = this.model.getRelatedRecords('scrumepics');
        return this.epics;
    }

    private selectComponent(id) {
        this.focus = id;
        this.scrum.selectedID(id);
    }

    get chevron() {
        return this.expanded ? 'chevrondown' : 'chevronright';
    }

    private toggleExpand() {
        this.expanded = !this.expanded;
    }

}
