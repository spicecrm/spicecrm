import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

@Component({
    selector: '[object-list-item]',
    templateUrl: './src/objectcomponents/templates/objectlistitem.html',
    providers: [model, view],
    styles: [
        ':host /deep/ field-container global-button-icon {display:none;}',
        ':host:hover /deep/ field-container global-button-icon {display:inline;}',
    ]
})
export class ObjectListItem implements OnInit {

    @Input() private rowselect: boolean = false;
    @Input() private rowselectdisabled: boolean = false;
    @Input() private listFields: any[] = [];
    @Input() private listItem: any = {};
    @Input() private inlineedit: boolean = false;
    @Input() private displaylinks: boolean = true;

    // input param to determine if theaction menu is shown for the model
    @Input() private showActionMenu: boolean = true;

    constructor(private model: model, private modelutilities: modelutilities, private modellist: modellist, private view: view, private router: Router, private language: language) {
    }

    public ngOnInit() {
        this.model.module = this.modellist.module;
        this.model.id = this.listItem.id;
        this.model.data = this.modelutilities.backendModel2spice(this.modellist.module, this.listItem);
        this.model.initializeFieldsStati();

        this.view.isEditable = this.inlineedit && this.model.checkAccess('edit');
        this.view.displayLinks = this.displaylinks;
    }

    private navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }
}
