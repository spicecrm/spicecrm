/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, ContentElementI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelement.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public element: ContentElementI;
    /**
     * emit when delete button clicked
     */
    @Output() public delete$: EventEmitter<void> = new EventEmitter();
    /**
     * hold the edit mode boolean
     */
    @Input() public isEditMode: boolean = false;
    /**
     * interface attribute list for the element to loop through
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'width', type: 'text'},
        {name: 'background-color', type: 'color'}
    ];
    /**
     * hold the style object for the element
     */
    private style = {};

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate body style from attributes
     */
    public ngOnInit() {
        this.generateStyle();
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.element.attributes = res.attributes;
        this.generateStyle();
        this.cdRef.detectChanges();
    }

    /**
     * generate body style object
     */
    private generateStyle() {
        this.style = JSON.parse(JSON.stringify(this.element.attributes));
    }

    /**
     * set the hovered element level
     * @param value
     */
    private setIsMouseIn(value) {
        this.spicePageBuilderService.isMouseIn = value ? 'content' : 'section';
    }

    /**
     * set the current editing element
     */
    private edit() {
        this.modal.openModal('SpicePageBuilderEditor', true, this.injector).subscribe(modalRef => {
            modalRef.instance.element = JSON.parse(JSON.stringify(this.element));
            modalRef.instance.response.subscribe(res => {
                if (!!res) {
                    this.handleEditResponse(res);
                }
            });
        });
    }
}
