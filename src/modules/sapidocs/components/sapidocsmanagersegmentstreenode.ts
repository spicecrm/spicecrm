/**
 * @module ModuleSAPIDOCs
 */
import {Component, Input, OnInit, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI, sapIDOCSegmentRelationI} from "../../../modules/sapidocs/interfaces/moudesapidocs.interfaces";

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
    // private segment: sapIDOCSegmentI;

    /**
     * the segments underneath this one
     */
    // private children: sapIDOCSegmentRelationI[] = [];

    /**
     * boolean flag if the node is expanded
     */
    private expanded: boolean = false;

    constructor(private language: language, private modal: modal, private injector: Injector, private sapIdocsManager: sapIdocsManager) {

    }

    /**
     * the segments underneath this one
     */
    get children(): sapIDOCSegmentRelationI[] {
        return this.segmentrelation.segment_id ? this.sapIdocsManager.getSegments(this.segmentrelation.segment_id) : [];
    }

    get segment(): sapIDOCSegmentI {
        return this.segmentrelation.segment_id ? this.sapIdocsManager.getSegmentById(this.segmentrelation.segment_id) : undefined;
    }

    /**
     * returns if the current segment is inactive
     */
    get segmentstyle() {

        if (this.segment.active == '0') {
            return {
                'text-decoration': 'line-through'
            };
        }

        return {};
    }

    public ngOnInit(): void {
        // get the segment
        // this.segment = this.sapIdocsManager.getSegmentById(this.segmentrelation.segment_id);

        // get the children
        // this.children = this.sapIdocsManager.getSegments(this.segmentrelation.segment_id);
    }

    /**
     * returns if the node is deleted
     */
    get deleted() {
        return this.segment.deleted == '1';
    }

    /**
     * returns a boolean if the current segment is selected
     */
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

    // open the add segment modal
    private addSegment() {
        this.modal.openModal('SAPIDOCsManagerSegmentAddModal', true, this.injector).subscribe(componentRef => {
            componentRef.instance.parentsegment_id = this.segment.id;
            componentRef.instance.added.subscribe((added: sapIDOCSegmentI) => {
                // get the children
                // this.children = this.sapIdocsManager.getSegments(this.segmentrelation.segment_id);

                // expand the node
                this.expanded = true;

                // select the new segment
                this.sapIdocsManager.selectSegment(added.id);
            });
        });
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

