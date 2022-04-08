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
import {footer} from "../../services/footer.service";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'system-label-modulename',
    templateUrl: '../templates/systemlabelmodulename.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemLabelModulename implements OnChanges, AfterViewInit, OnDestroy {

    /**
     * the module
     */
    @Input() public module: string;

    /**
     * the field
     */
    @Input() public singular: boolean = false;

    /**
     * the field
     */
    @Input() public length: 'default' | 'long' | 'short' = 'default';

    /**
     * the subscription on the language
     */
    public subsciptions: Subscription = new Subscription();

    constructor(public language: language,
                public modal: modal,
                public footer: footer,
                public metadata: metadata,
                public renderer: Renderer2,
                public cdRef: ChangeDetectorRef) {
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
     * handle double click
     * @param event
     * @private
     */
    public onDblClick(event: MouseEvent) {
        this.openModal();
        event.preventDefault();
    }

    /**
     * open label editor modal
     * @private
     */
    public openModal() {
        let moduleDefs = this.metadata.getModuleDefs(this.module);
        const label = !this.singular ? moduleDefs.module_label : moduleDefs.singular_label;
        this.modal.openModal('SystemLabelEditorModal', true).subscribe(modalRef => {
            modalRef.instance.labelData = {name: label, global_translations: [], custom_translations: []};
        });
    }

    /**
     * triggers the change detection when the language is changed
     */
    public detectChanges() {
        this.cdRef.detectChanges();
    }

    /**
     * handle right click to edit translations
     * @private
     */
    public onRightClick(event) {
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
    public closeDropdown(event: MouseEvent, dropdown: HTMLElement) {
        if (this.footer.footercontainer.element.nativeElement.contains(dropdown)) {
            this.renderer.removeChild(this.footer.footercontainer.element.nativeElement, dropdown);
        }
    }

    /**
     * create dropdown
     * @param event
     * @private
     */
    public createDropdown(event: MouseEvent): HTMLElement {
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
