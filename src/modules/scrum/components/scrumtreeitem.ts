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
    selector: 'scrum-tree-item',
    templateUrl: './src/modules/scrum/templates/scrumtreeitem.html',
    providers: [model]
})
export class ScrumTreeItem implements OnInit {
    @Input() private epic: any = {};

    @Input() private focus: string = '';

    constructor(private metadata: metadata, private model: model, private modellist: modellist) {}

    public ngOnInit() {
        this.model.module = 'ScrumEpics';
        this.model.initialize();
        this.model.id = this.epic.id;
        this.model.data = this.epic;
    }


}
