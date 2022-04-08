/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, EventEmitter, AfterViewInit} from "@angular/core";

@Component({
    selector: "system-component-container",
    templateUrl: "../templates/systemcomponentcontainer.html",
})
export class SystemComponentContainer implements AfterViewInit {

    @ViewChild("container", {read: ViewContainerRef, static: true}) public container: ViewContainerRef;
    public containerRef = new EventEmitter<ViewContainerRef>();

    public loaded: boolean = false;
    public containerComponent: string = "";

    public ngAfterViewInit() {
        this.containerRef.emit(this.container);
        this.containerRef.complete();
    }
}
