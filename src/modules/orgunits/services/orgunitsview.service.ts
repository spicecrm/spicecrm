import {EventEmitter, Injectable, NgZone, OnDestroy, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject, Subscription} from "rxjs";

@Injectable()
export class orgunitsViewService {

    /**
     * the viewport from the main view
     */
    public viewport: any;

    /**
     * the model of the org chart
     */
    public orgChart: model;

    /**
     * an event emitter that fires when the service updated connections
     */
    public updated$: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the linked orgunits
     */
    public orgunits = [];

    /**
     * the linked orgcharts
     */
    public orgcharts = [];

    /**
     * holds the rendered elements
     */
    public orgchartElements: any[] = [];

    /**
     * the list of connectors
     */
    public connectors: string[] = [];

    /**
     * indicates if the chart is loading
     */
    public loading: boolean = true;

    public constructor(
        private model: model,
        private backend: backend
    ) {

    }


    public loadOrgUnits(): Observable<any>{
        let retSubject = new Subject();

        // reset all data
        this.orgchartElements = [];
        this.orgunits = [];
        this.orgcharts = [];
        this.connectors = [];

        this.loading = true;
        this.backend.getRequest(`module/OrgCharts/${this.model.id}/allOrgunits`).subscribe({
            next: (beans) => {
                this.orgunits = beans.orgunits;
                this.orgcharts = beans.orgcharts;

                // ugly but effective way to ensure the update ont eh page happens before the update on the connectors happen
                window.setTimeout(() => this.buildConnectors(), 0);

                retSubject.next(true);
                retSubject.complete();

                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
                retSubject.error('could not load orgunits');
            }
        })

        return retSubject.asObservable();
    }

    /**
     * deletes an orgunit with the given ID
     *
     * @param id
     */
    public deleteOrgUnit(id){
        this.orgunits.splice(this.orgunits.findIndex(o => o.id == id), 1);
        this.orgchartElements.splice(this.orgchartElements.findIndex(o => o.id == id), 1);

        // ugly but effective way to ensure the update ont eh page happens before the update on the connectors happen
        window.setTimeout(() => this.buildConnectors(), 0);
    }

    public setNativeElement(id, element){
        let e = this.orgchartElements.find(o => o.id == id);
        if(e){
            e.nativeElement = element;
        } else {
            this.orgchartElements.push({
                id: id,
                nativeElement: element
            });
        }
        this.buildConnectors();
    }

    public buildConnectors(){
        // mke sure we have all native elements
        if(this.orgunits.length + this.orgcharts.length != this.orgchartElements.length) return;

        this.connectors = [];
        let root = this.orgunits.find(o => !o.parent_id);
        this.buildConnectorsForNode(root.id);
        this.updated$.emit(true);
    }

    public buildConnectorsForNode(nodeid){
        let ne = this.orgchartElements.find(oe => oe.id == nodeid).nativeElement;
        // build the viewport rect
        let viewPortRect = {
            top: this.viewport.getBoundingClientRect().top,
            left: this.viewport.getBoundingClientRect().left,
            width: this.viewport.scrollWidth,
            height: this.viewport.scrollHeight
        }

        // get all linked OrgUnits & OrgCharts
        let children = this.orgunits.filter(s => s.parent_id == nodeid).map(c => c.id).concat(this.orgcharts.filter(s => s.orgunit_id == nodeid).map(c => c.id));
        if (children.length > 0) {
            let mBox = ne.getBoundingClientRect();
            let mBoxX = mBox.left + (mBox.width / 2) - viewPortRect.left;
            let mBoxY = mBox.bottom - viewPortRect.top;

            let childCoordinates = [];
            let maxCX = null;
            let minCY = null;
            let minCX = null;
            for (let child of children) {
                let ce = this.orgchartElements.find(oe => oe.id == child).nativeElement;
                let cBox = ce.getBoundingClientRect();
                let cBoxX = cBox.left + (cBox.width / 2) - viewPortRect.left;
                let cBoxY = cBox.top - viewPortRect.top;

                if (!maxCX || cBoxX > maxCX) maxCX = cBoxX;
                if (!minCX || cBoxX < minCX) minCX = cBoxX;
                if (!minCY || cBoxY < minCY) minCY = cBoxY;

                childCoordinates.push({cBoxX, cBoxY})
            }

            let midY = mBoxY + (minCY - mBoxY) / 2;
            this.connectors.push(`M ${mBoxX},${mBoxY} L ${mBoxX},${midY}`);
            this.connectors.push(`M ${minCX},${midY} L ${maxCX},${midY}`);
            for (let cc of childCoordinates) {
                this.connectors.push(`M ${cc.cBoxX},${midY} L ${cc.cBoxX},${cc.cBoxY}`);
            }
            for (let child of children) {
                this.buildConnectorsForNode(child);
            }
        }
    }

}
