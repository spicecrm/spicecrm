/**
 * @module ModuleScrum
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef, OnDestroy, AfterViewInit, OnInit, Input
} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
@Component({
    selector: '[scrum-tree-branch]',
    templateUrl: './src/modules/scrum/templates/scrumtreebranch.html',
    providers: [model]
})
export class ScrumTreeBranch implements OnInit {
    private userstories: any[] = [];
    private expanded: boolean = false;

    @Input() private epic: any = {};

    @Input() private focus: string = '';

    constructor(private metadata: metadata, private model: model, private modellist: modellist) {}

    public ngOnInit() {
        this.model.module = 'ScrumEpics';
        this.model.initialize();
        this.model.id = this.epic.id;
        this.model.data = this.epic;
    }

    private loadRelatedUserStories() {
        this.userstories = this.model.getRelatedRecords('scrumuserstories');
        return this.userstories;
    }

    get chevron() {
        return this.expanded ? 'chevrondown' : 'chevronright';
    }

    private toggleExpand() {
        this.expanded = !this.expanded;
    }

}
