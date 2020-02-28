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
    templateUrl: './src/modules/scrum/templates/scrumtreeuserstory.html',
    providers: [model],
    host:{
        '(click)': "selectUserStory($event)",
    }
})
export class ScrumTreeUserStory implements OnInit, OnDestroy {
    @Input() private userstory: any = {};

    constructor(private metadata: metadata, private model: model, private modellist: modellist, private scrum: scrum) {}

    /**
     * initialize model
     */
    public ngOnInit() {
        this.model.module = 'ScrumUserStories';
        this.model.initialize();
        this.model.id = this.userstory.id;
        this.model.data = this.userstory;
    }

    /**
     * stop propagating other objects
     * send the current object
     * @param e
     */
    private selectUserStory(e) {
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
