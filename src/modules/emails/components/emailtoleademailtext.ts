/**
 * @module ModuleEmails
 */
import {
    Component,
    Input,
    Output,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    EventEmitter
} from "@angular/core";
import {language} from "../../../services/language.service";

@Component({
    selector: "email-to-lead-emailtext",
    templateUrl: "./src/modules/emails/templates/emailtoleademailtext.html"
})
export class EmailToLeadEmailText implements OnDestroy {

    @ViewChild("contextMenu", {read: ViewContainerRef, static: true}) public contextMenu: ViewContainerRef;

    @Input() private emailtext: string = "";
    @Input() private emailhtml: string = "";
    @Input() private emailmodule: string = "";
    @Input() private emailfields: Array<string> = ["first_name", "last_name"];

    @Output() private setfield: EventEmitter<any> = new EventEmitter<any>();

    private clickListener: any = null;
    private displayContextMenu: boolean = false;
    private displayContextCoordinates: any = {top: 0, left: 0};

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {
    }

    get content() {
        return this.emailhtml ? this.emailhtml : this.emailtext;
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private showContextMenu(event) {
        if (this.selectedText) {
            // prevent the browser context Menu
            event.preventDefault();

            // show the options
            this.displayContextMenu = true;
            this.displayContextCoordinates.top = event.clientY;
            this.displayContextCoordinates.left = event.clientX;

            // set a clicklistener
            this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
        }
    }

    get selectedText() {
        let selected = window.getSelection().toString();

        return selected ? selected.trim() : "";
    }

    get contextMenuStyle() {
        let frameCoords = this.elementRef.nativeElement.getBoundingClientRect();
        let stylecoords = {
            top: this.displayContextCoordinates.top - frameCoords.top + "px",
            left: this.displayContextCoordinates.left - frameCoords.left + "px",
        }
        return stylecoords;
    }

    private onClick(event: MouseEvent): void {
        if (!this.contextMenu.element.nativeElement.contains(event.target)) {
            this.displayContextMenu = false;
            if (this.clickListener) {
                this.clickListener();
                this.clickListener = null;
            }
        }
    }

    private setField(field) {
        this.displayContextMenu = false;
        if (this.clickListener) {
            this.clickListener();
            this.clickListener = null;
        }

        this.setfield.emit({field: field, value: this.selectedText});
    }
}
