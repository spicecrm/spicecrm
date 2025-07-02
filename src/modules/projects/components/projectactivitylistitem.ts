import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    input,
    InputSignal,
    OnInit,
    Output
} from '@angular/core';
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    selector: '[project-activity-list-item]',
    templateUrl: '../templates/projectactivitylistitem.html',
    providers: [model, view],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class projectActivityListItem implements OnInit {

    /**
     * activity item
     */
    public activity: InputSignal<any> = input({});

    /**
     * fieldset fields
     */
    public listFields: InputSignal<any[]> = input([])

    /**
     * selected state
     */
    public isSelected: InputSignal<boolean> = input();

    @Output() public toggleSelect: EventEmitter<void> = new EventEmitter();

    @Output() public goDetail: EventEmitter<void> = new EventEmitter();

    constructor(public model: model, public view: view) {}

    public ngOnInit() {
        this.model.module = 'ProjectActivities'
        this.model.id = this.activity().id;
        this.model.setData(this.activity());

        this.model.startEdit();

        this.view.isEditable = true
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

}