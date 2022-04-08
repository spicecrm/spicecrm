/**
 * @module ModuleScrum
 */
import {
    Component, OnInit, Input, OnDestroy
} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {scrum} from '../services/scrum.service';

@Component({
    selector: '[scrum-tree-userstory]',
    templateUrl: '../templates/scrumtreeuserstory.html',
    providers: [model],
    host:{
        '(click)': "selectUserStory($event)",
    }
})
export class ScrumTreeUserStory implements OnInit, OnDestroy {
    @Input() public userstory: any = {};

    constructor(public metadata: metadata, public model: model, public modellist: modellist, public scrum: scrum) {}

    /**
     * initialize model
     */
    public ngOnInit() {
        this.model.module = 'ScrumUserStories';
        this.model.initialize();
        this.model.id = this.userstory.id;
        this.model.setData(this.userstory);
    }

    /**
     * stop propagating other objects
     * send the current object
     * @param e
     */
    public selectUserStory(e) {
        e.stopPropagation();
        this.scrum.selectedObject = {id: this.userstory.id, type: 'ScrumUserStories'};
    }

    /**
     * unset selectedObject on destroy
     */
    public ngOnDestroy(): void {
        if (this.scrum.selectedObject.id == this.userstory.id && this.scrum.selectedObject.type == 'ScrumUserStories') {
            this.scrum.selectedObject = {id: undefined, type: ''};
        }
    }

}
