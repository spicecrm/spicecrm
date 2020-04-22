/**
 * @module ModuleScrum
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";

@Component({
    selector: '[sapidocs-manager-segments-tree-node]',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmanagersegmentstreenode.html',
    host: {
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level + 1'
    }
})

export class SAPIDOCsManagerSegmentsTreeNode implements OnInit {

    /**
     * the segment
     */
    @Input() private segmentrelation: any;

    /**
     * the level
     */
    @Input() private level: number = 1;

    /**
     * the segment details
     */
    private segment: any = {};

    /**
     * the segments underneath this one
     */
    private children: any[] = [];

    private expanded: boolean = false;

    constructor(private language: language, private sapIdocsManager: sapIdocsManager) {

    }

    public ngOnInit(): void {
        // get the segment
        this.segment = this.sapIdocsManager.getSegmentById(this.segmentrelation.segment_id);

        // get the children
        this.children = this.sapIdocsManager.getSegments(this.segmentrelation.segment_id);
    }

    get selected() {
        return this.segment.id == this.sapIdocsManager.selectedsegment;
    }

    /**
     * toggle open or closed
     */
    private toggle() {
        this.expanded = !this.expanded;
    }

    /**
     * set the seleted node to the service
     */
    private selectNode(e: MouseEvent) {
        e.stopPropagation();
        this.sapIdocsManager.selectSegment(this.segment.id);
    }

}

