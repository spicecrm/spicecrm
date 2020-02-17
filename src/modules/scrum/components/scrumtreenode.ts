/**
 * @module ModuleScrum
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';

import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'scrumtree-node',
    templateUrl: './src/modules/scrum/templates/scrumtreenode.html',
    providers: [model]
})
export class ScrumTreeNode implements OnInit {

    @Input() private theme: any = {};

    @Input() private focus: string = '';

    private epics: any[] = [];
    private hidden: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model) {
    }

    public ngOnInit() {
        this.model.module = 'ScrumThemes';
        this.model.initialize();
        this.model.id = this.theme.id;
        this.model.data = this.theme;
    }

    private loadRelatedEpics() {
        this.hidden = false;
        this.epics = this.model.getRelatedRecords('scrumepics');
        return this.epics;
    }

}
