import {Component, Input, OnInit} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {model} from '../../../services/model.service';
import {Router} from "@angular/router";

@Component({
    selector: 'groupware-detail-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwaredetailpanebean.html'
})
export class GroupwareDetailPaneBean implements OnInit {

    @Input() private bean: any;

    constructor(
        private groupware: GroupwareService,
        private model: model,
        private router: Router,
    ) {
    }

    public ngOnInit() {

    }

    private onClick(event) {
        this.router.navigate(['module/' + this.bean.module + '/' + this.bean.id]);
    }
}
