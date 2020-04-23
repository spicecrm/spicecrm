/**
 * @module ModuleSAPIDOCs
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";

@Component({
    selector: '[sapidocs-manager-segments-tree-ipoc-type]',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentstreeidoctype.html',
    host: {
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level + 1'
    }
})

export class SAPIDOCsManagerSegmentsTreeIdocType implements OnInit {

    /**
     * the segment
     */
    @Input() private idoctype: any;

    /**
     * the level
     */
    @Input() private level: number = 0;

    /**
     * the segments underneath this one
     */
    private children: any[] = [];

    /**
     * if the node is expanded
     */
    private expanded: boolean = false;

    constructor(private language: language, private sapIdocsManager: sapIdocsManager) {

    }

    public ngOnInit(): void {

        // get the children
        this.children = [this.idoctype];
    }

    /**
     * toggle open or closed
     */
    private toggle() {
        this.expanded = !this.expanded;
    }

    private select(e: MouseEvent) {
        e.stopPropagation();
        this.sapIdocsManager.selectSegment(undefined);
    }

    /**
     * returns if the node is deleted
     */
    get deleted() {
        return this.idoctype.deleted == '1';
    }

    /**
     * @ignore
     *
     * a trackby function for the loop
     *
     * @param index
     * @param item
     */
    private trackByFn(index, item) {
        return item.id;
    }

}

