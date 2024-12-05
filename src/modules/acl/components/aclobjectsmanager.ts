/**
 * @module ModuleACL
 */
import {Component, ElementRef, ViewChild, ViewContainerRef} from "@angular/core";
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    selector: 'aclobjects-manager',
    templateUrl: "../templates/aclobjectsmanager.html",
})
export class ACLObjectsManager {

    @ViewChild("managercontent", {read: ViewContainerRef, static: true}) elementmanagercontent: ViewContainerRef;

    public activeobjectid: string = "";
    public activetypeid: string = "";

    /**
     * holds the whole current acl object
     */
    public activeObject: any = {};

    constructor(
        public modelutilities: modelutilities,
        public elementRef: ElementRef
    ) {}

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: "calc(100% - " + rect.top + "px"
        };
    }

    public setObject(objectid){
        this.activeobjectid = objectid;
    }

    public setType(typeid){
        this.activetypeid = typeid;
    }

    /**
     * handles updates to the object when emitted by ACLObjectsManagerObjects
     * i.e. when the status changes
     *
     * @param updatedObject
     */
    public onObjectUpdated(updatedObject: any) {
        if (this.activeobjectid === updatedObject.id) {
            // Update the active object reference in the parent
            this.activeObject = {...updatedObject};
        }
    }
}
