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
    EventEmitter, OnInit
} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: "email-to-object-emailtext",
    templateUrl: "../templates/emailtoobjectemailtext.html"
})
export class EmailToObjectEmailText implements OnDestroy, OnInit {

    @ViewChild("contextMenu", {read: ViewContainerRef, static: true}) public contextMenu: ViewContainerRef;

    @Input() public text: string = "";
    @Input() public html: string = "";
    @Input() public target_module_name: string = "";
    @Input() public target_module_fields = [];

    @Output() public setfield: EventEmitter<any> = new EventEmitter<any>();

    public clickListener: any = null;
    public displayContextMenu: boolean = false;
    public displayContextCoordinates: any = {top: 0, left: 0};
    public _striped_content: string;

    constructor(
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public language: language,
        public metadata: metadata,
    ) {

    }

    get content(): string {
        return this.html ? this.html : this.text;
    }

    get striped_content(): string
    {
        if(this._striped_content) {
            return this._striped_content;
        }

        if(this.html) {
            this._striped_content = this.html
                .replace(/<!--.*?-->/gs, "")    // removes comments <!-- blabla -->
                .replace(/<[^>]+>/g,"")        // removes all kinds of tags
                .replace(/[ ]{2,}/g, " ").replace(/[\n\r]{3,}/g, "\n");
        } else {
            this._striped_content = this.text;
        }
        return this._striped_content;
    }

    public ngOnInit() {
        if(!this.target_module_fields || this.target_module_fields.length === 0) {
            let available_types: Array<string> = ["varchar", "text"];
            let field_defs = this.metadata.getModuleFields(this.target_module_name);
            //console.log(field_defs);
            for(let field in field_defs) {
                if(available_types.indexOf(field_defs[field].type) >= 0 && field_defs[field].vname && field_defs[field].name !== "id") {
                    this.target_module_fields.push(field);
                }
            }
        }
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
            this.clickListener = this.renderer.listen("document", "click", (clickevent) => this.onClick(clickevent));
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
