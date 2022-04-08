/**
 * @module ModuleSAPIDOCs
 */
import {Component, Input, OnInit, Injector} from '@angular/core';
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {sapIdocsManager} from "../../../modules/sapidocs/services/sapidocsmanager.service";
import {sapIDOCSegmentI, sapIDOCTypeI} from "../interfaces/moudesapidocs.interfaces";

@Component({
    selector: '[sapidocs-manager-segments-tree-ipoc-type]',
    templateUrl: '../templates/sapidocsmanagersegmentstreeidoctype.html',
    host: {
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level + 1'
    }
})

export class SAPIDOCsManagerSegmentsTreeIdocType implements OnInit {

    /**
     * the segment
     */
    @Input() public idoctype: sapIDOCTypeI;

    /**
     * the level
     */
    @Input() public level: number = 0;

    /**
     * the segments underneath this one
     */
    public children: any[] = [];

    /**
     * if the node is expanded
     */
    public expanded: boolean = false;

    constructor(public language: language, public modal: modal, public injector: Injector, public sapIdocsManager: sapIdocsManager) {

    }

    public ngOnInit(): void {

        // get the children
        this.children = this.idoctype.segments;
        this.children.sort((a, b) => {
           return a.segment_order > b.segment_order ? 1 : -1;
        });
    }

    /**
     * toggle open or closed
     */
    public toggle() {
        this.expanded = !this.expanded;
    }

    public select(e: MouseEvent) {
        e.stopPropagation();
        this.sapIdocsManager.selectSegment(undefined);
    }


    // open the add segment modal
    public addSegment() {
        this.modal.openModal('SAPIDOCsManagerSegmentAddModal', true, this.injector).subscribe(componentRef => {
            componentRef.instance.idoctyp = this.idoctype.idoctyp;
            componentRef.instance.mestyp = this.idoctype.mestyp;
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
     * returns if the node is deleted
     */
    get deleted() {
        return false; // this.idoctype.deleted == '1';
    }

    /**
     * @ignore
     *
     * a trackby function for the loop
     *
     * @param index
     * @param item
     */
    public trackByFn(index, item) {
        return item.id;
    }

}

