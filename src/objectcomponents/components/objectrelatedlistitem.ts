import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {footer} from '../../services/footer.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';

@Component({
    selector: '[object-related-list-item]',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistitem.html',
    providers: [model, view]
})
export class ObjectRelatedListItem implements OnInit {
    @Input() listfields: Array<any> = [];
    @Input() listitem: any = {};
    @Input() module: string = '';
    @Input() editable: boolean = false;
    @Input() editcomponentset: string = '';

    customEditActions: Array<any> = [];
    customActions: Array<any> = [];

    constructor(private metadata: metadata, private footer: footer, protected model: model, private relatedmodels: relatedmodels, private view: view, private router: Router, private language: language) {

    }

    ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.listitem.id;
        this.model.data = this.listitem;

        // set editable if the user is allowed to edit the record
        if (this.model.data.acl.edit){
            this.view.isEditable = this.editable;

            this.customActions.push({action: 'edit', name: this.language.getLabel('LBL_EDIT')});
            this.customActions.push({action: 'remove', name: this.language.getLabel('LBL_REMOVE')});
        }

        if (this.editable) {
            this.customEditActions.push({action: 'canceledit', name: this.language.getLabel('LBL_CANCEL')});
            this.customEditActions.push({action: 'saverelated', name: this.language.getLabel('LBL_SAVE')});
        }
    }

    navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    handleAction(action) {
        switch (action) {
            case 'canceledit':
                this.model.cancelEdit();
                this.view.setViewMode();
                break;
            case 'edit':
                this.metadata.addComponentDirect('ObjectEditModalWReference', this.footer.footercontainer).subscribe(editModalRef => {
                    editModalRef.instance.model.module = this.module;
                    editModalRef.instance.model.id = this.model.id;
                    editModalRef.instance.model.data = this.model.data;

                    if (this.editcomponentset && this.editcomponentset != '') {
                        editModalRef.instance.componentSet = this.editcomponentset;
                    }
                   this.model.startEdit();
                    editModalRef.instance.modalAction$.subscribe(action => {
                        if(action === false){
                            editModalRef.destroy();
                            this.model.cancelEdit();
                        } else {
                            this.relatedmodels.setItem(this.model.data);
                            this.model.endEdit();
                            editModalRef.destroy();
                        }
                    })
                });
                break;
            case 'remove':
                this.relatedmodels.deleteItem(this.model.id);
                break;
            case 'saverelated':
                if (this.model.validate()) {
                    this.relatedmodels.setItem(this.model.data);
                    this.model.endEdit();
                    this.view.setViewMode();
                }
                break;
        }
    }


}