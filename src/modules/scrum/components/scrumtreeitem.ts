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
    selector: '[scrum-tree-item]',
    templateUrl: './src/modules/scrum/templates/scrumtreeitem.html',
    providers: [model]
})
export class ScrumTreeItem implements OnInit {
    @Input() private userstory: any = {};

    @Input() private focus: string = '';

    constructor(private metadata: metadata, private model: model, private modellist: modellist) {}

    public ngOnInit() {
        this.model.module = 'ScrumUserStories';
        this.model.initialize();
        this.model.id = this.userstory.id;
        this.model.data = this.userstory;
    }



}
