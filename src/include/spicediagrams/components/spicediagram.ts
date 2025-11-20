import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    input,
    InputSignal,
    OnChanges,
    output,
    OutputEmitterRef,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {SpiceDiagramService} from "../services/spicediagrams.service";
import {
    DiagramItemI,
    DiagramLinkChangeI,
    DiagramOptionsI,
    DiagramItemChangeI
} from "../interfaces/spicediagrams.interfaces";
import {model} from "../../../services/model.service";

@Component({
    selector: 'spice-diagram',
    templateUrl: '../templates/spicediagram.html',
    standalone: false,
    providers: [
        SpiceDiagramService,
        model
    ],
    host: {class: 'spice-display-block'}
})
export class SpiceDiagram implements AfterViewInit, OnChanges {
    /**
     * holds the passed items of the diagram
     */
    public items: InputSignal<DiagramItemI[]> = input();
    /**
     * holds the diagram data
     */
    public diagramData: InputSignal<string> = input();
    /**
     * holds the diagram options
     */
    public options: InputSignal<DiagramOptionsI> = input();
    /**
     * holds the module name for editing
     */
    public module: InputSignal<string> = input();
    /**
     * emit on item create
     */
    public onItemChange$: OutputEmitterRef<DiagramItemChangeI> = output();
    /**
     * emit on item create
     */
    public onCreate$: OutputEmitterRef<DiagramItemI> = output();
    /**
     * emit on item create
     */
    public onDelete$: OutputEmitterRef<string> = output();
    /**
     * emit on diagram data change
     */
    public onDiagramDataChange$: OutputEmitterRef<{svg: string, xml: string}> = output();
    /**
     * emit when two items are linked
     */
    public onLink$: OutputEmitterRef<DiagramLinkChangeI> = output();

    /**
     * reference to the diagram container
     */
    @ViewChild('diagramContainer', {read: ElementRef}) diagramContainer: ElementRef;

    constructor(public spiceDiagramService: SpiceDiagramService) {

        this.listenToCreateEvent();
        this.listenToDataChangeEvent();
        this.listenToLinkEvent();
        this.listenToDeleteEvent();
        this.listenToTypeChange();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.items) {
            this.spiceDiagramService.setItems(this.items());
        }

        if (changes.diagramData) {
            this.spiceDiagramService.loadData(this.diagramData());
        }

        if (changes.module) {
            this.spiceDiagramService.module = this.module();
        }
    }

    public ngAfterViewInit(): void {

        this.spiceDiagramService.initialize(this.diagramContainer.nativeElement, this.options()).subscribe(loaded => {
            if (loaded) {
                this.spiceDiagramService.loadData(this.diagramData());
            }
        });
    }

    /**
     * listen to the type change event from the service and emit to the parent
     * @private
     */
    private listenToTypeChange() {
        effect(() => {
            const latestItemChange = this.spiceDiagramService.latestItemChange();
            if (latestItemChange) {
                this.onItemChange$.emit(latestItemChange);
            }
        });
    }

    /**
     * listen to the link event from the service and emit to the parent
     * @private
     */
    private listenToLinkEvent() {
        effect(() => {
            const latestLink = this.spiceDiagramService.latestLinkChange();
            if (latestLink) {
                this.onLink$.emit(latestLink);
            }
        });
    }

    /**
     * listen to the link event from the service and emit to the parent
     * @private
     */
    private listenToDeleteEvent() {
        effect(() => {
            const latestDeletedId = this.spiceDiagramService.latestDeletedItemId();
            if (latestDeletedId) {
                this.onDelete$.emit(latestDeletedId);
            }
        });
    }

    /**
     * listen to the data change event from the service and emit to the parent
     * @private
     */
    private listenToDataChangeEvent() {
        effect(() => {
            const diagramData = this.spiceDiagramService.diagramData();
            if (diagramData && this.diagramData() != diagramData.xml) {
                this.onDiagramDataChange$.emit(diagramData);
            }
        });
    }

    /**
     * listen to the create event from the service and emit to the parent
     * @private
     */
    private listenToCreateEvent() {
        effect(() => {
            const newItem = this.spiceDiagramService.latestCreatedItem();
            if (newItem) {
                this.onCreate$.emit(newItem);
            }
        });
    }
}