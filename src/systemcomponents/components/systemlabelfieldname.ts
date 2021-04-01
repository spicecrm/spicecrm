/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";

@Component({
    selector: 'system-label-fieldname',
    templateUrl: './src/systemcomponents/templates/systemlabelfieldname.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabelFieldname implements OnChanges, AfterViewInit, OnDestroy {

    /**
     * the module
     */
    @Input() private module: string;

    /**
     * the field
     */
    @Input() private field: string;

    /**
     * the field
     */
    @Input() private fieldconfig: any = {};

    /**
     * the field
     */
    @Input() private length: 'default' | 'long' | 'short' = 'default';

    /**
     * the subscription on the language
     */
    private subsciptions: Subscription = new Subscription();

    constructor(private language: language,
                private modal: modal,
                private metadata: metadata,
                private renderer: Renderer2,
                private footer: footer,
                private cdRef: ChangeDetectorRef) {
        this.subsciptions.add(
            this.language.currentlanguage$.subscribe(() => this.detectChanges())
        );
    }


    /**
     * detach from changes detections to handle it manually
     */
    public ngAfterViewInit() {
        this.cdRef.detach();
    }

    /**
     * unsubscribe from the language service when the component is destroyed
     */
    public ngOnDestroy(): void {
        this.subsciptions.unsubscribe();
    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectChanges();
    }

    /**
     * open label editor modal
     * @private
     */
    public openModal() {
        this.modal.openModal('SystemLabelEditorModal', true).subscribe(modalRef => {
            const label = this.fieldconfig.label || this.metadata.getFieldlabel(this.module, this.field);
            modalRef.instance.labelData = {name: label, global_translations: [], custom_translations: []};
        });
    }

    /**
     * handle double click
     * @param event
     * @private
     */
    private onDblClick(event: MouseEvent) {
        this.openModal();
        event.preventDefault();
    }

    /**
     * triggers the change detection when the language is changed
     */
    private detectChanges() {
        this.cdRef.detectChanges();
    }

    /**
     * handle right click to edit translations
     * @private
     */
    private onRightClick(event) {
        const dropdown = this.createDropdown(event);
        this.renderer.appendChild(this.footer.footercontainer.element.nativeElement, dropdown);
        const docClickListener = this.renderer.listen('document', 'click', event => {
            this.closeDropdown(event, dropdown);
            docClickListener();
        });
        event.preventDefault();
    }

    /**
     * remove the dropdown from the footer
     * @param event
     * @param dropdown
     * @private
     */
    private closeDropdown(event: MouseEvent, dropdown: HTMLElement) {
        if (this.footer.footercontainer.element.nativeElement.contains(dropdown)) {
            this.renderer.removeChild(this.footer.footercontainer.element.nativeElement, dropdown);
        }
    }

    /**
     * create dropdown
     * @param event
     * @private
     */
    private createDropdown(event: MouseEvent): HTMLElement {
        const dropdown = this.renderer.createElement('div');
        const addClasses = (item, classes) => classes.forEach(itemClass => this.renderer.addClass(item, itemClass));
        this.renderer.setStyle(dropdown, 'top', event.pageY + 'px');
        this.renderer.setStyle(dropdown, 'left', event.pageX + 'px');
        addClasses(dropdown, ['slds-dropdown--inverse', 'slds-dropdown', 'slds-theme--inverse']);
        const ul = this.renderer.createElement('ul');
        this.renderer.addClass(ul, 'slds-dropdown__list');
        const li = this.renderer.createElement('li');
        addClasses(li, ['slds-slds-dropdown__item', 'slds-p-around--xx-small']);

        this.renderer.setProperty(li, 'onclick', () => this.openModal());
        this.renderer.setProperty(li, 'innerHTML', `<a>${this.language.getLabel('LBL_EDIT_LABEL')}</a>`);

        this.renderer.appendChild(ul, li);
        this.renderer.appendChild(dropdown, ul);
        return dropdown;
    }
}
