/**
 * @module ModuleMailboxes
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import {language} from "../../../services/language.service";

@Component({
    selector: "mailbox-email-to-lead-emailtext",
    templateUrl: "../templates/mailboxemailtoleademailtext.html",
})
export class MailboxEmailToLeadEmailText implements OnDestroy {

    @ViewChild("contextMenu", {read: ViewContainerRef, static: true}) contextMenu: ViewContainerRef;

    @Input() public emailtext: string = "";
    @Input() public emailhtml: string = "";
    @Input() public emailmodule: string = "";
    @Input() public emailfields: Array<string> = ["first_name", "last_name"];

    @Output() public setfield: EventEmitter<any> = new EventEmitter<any>();

    public clickListener: any = null;
    public displayContextMenu: boolean = false;
    public displayContextCoordinates: any = {top: 0, left: 0};

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public language: language) {
    }

    get content() {
        return this.emailhtml ? this.emailhtml : this.emailtext;
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    public showContextMenu(event) {
        if (this.selectedText) {
            // prevent the browser context Menu
            event.preventDefault();

            // show the options
            this.displayContextMenu = true;
            this.displayContextCoordinates.top = event.clientY;
            this.displayContextCoordinates.left = event.clientX;

            // set a clicklistener
            this.clickListener = this.renderer.listen(
                "document", "click",
                (event) => this.onClick(event),
            );
        }
    }

    get selectedText() {
        let selected = window.getSelection().toString();

        return selected ? selected.trim() : "";
    }

    get contextMenuStyle() {
        let frameCoords = this.elementRef.nativeElement.getBoundingClientRect();
        let stylecoords = {
            left: this.displayContextCoordinates.left - frameCoords.left + "px",
            top: this.displayContextCoordinates.top - frameCoords.top + "px",
        };
        return stylecoords;
    }

    public onClick(event: MouseEvent): void {
        if (!this.contextMenu.element.nativeElement.contains(event.target)) {
            this.displayContextMenu = false;
            if (this.clickListener) {
                this.clickListener();
                this.clickListener = null;
            }
        }
    }

    public setField(field) {
        this.displayContextMenu = false;
        if (this.clickListener) {
            this.clickListener();
            this.clickListener = null;
        }

        this.setfield.emit({field: field, value: this.selectedText});
    }

}
