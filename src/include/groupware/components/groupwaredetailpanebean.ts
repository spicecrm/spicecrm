import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {model} from '../../../services/model.service';
import {Router} from "@angular/router";

@Component({
    selector: 'groupware-detail-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwaredetailpanebean.html'
})
export class GroupwareDetailPaneBean implements OnInit {

    @Input() private bean: any;
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private groupware: GroupwareService,
        private model: model,
        private router: Router,
    ) {
    }

    public ngOnInit() {

    }

    private onClick(event) {
        this.selected.emit({module: this.bean.module, id: this.bean.id});
        // this.router.navigate(['module/' + this.bean.module + '/' + this.bean.id]);
    }
}
