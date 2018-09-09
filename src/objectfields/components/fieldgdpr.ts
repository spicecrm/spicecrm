import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-gdpr',
    templateUrl: './src/objectfields/templates/fieldgdpr.html'
})
export class fieldGDPR extends fieldGeneric implements OnInit {

    private gdprData: any = {};
    private loaded = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private modal: modal) {
        super(model, view, language, metadata, router);
    }

    ngOnInit() {
        this.backend.getRequest('gdpr/'+this.model.module+'/'+this.model.id).subscribe(gdprData => {
            this.gdprData = gdprData;
            this.loaded = true;
        });
    }

    getDataStyle(){
        if(!this.loaded)
            return {};

        if(this.model.data.gdpr_data_agreement == '1'){
            return {
                'background-color': '#009900',
                'color': 'white',
                'cursor': 'pointer'
            }
        }

        if(this.gdprData && this.gdprData.related) {
            for (let item of this.gdprData.related) {
                if (item.gdpr_data_agreement == '1') {
                    return {
                        'background-color': '#009900',
                        'color': 'white',
                        'cursor': 'pointer'
                    }
                }
            }
        }

        return {
            'background-color': '#cc0000',
            'color': 'white',
            'cursor': 'pointer'
        }

    }

    getMarketingStyle(){
        if(!this.loaded)
            return {};

        // if agreement was granted
        if(this.model.data.gdpr_marketing_agreement == 'g'){
            return {
                'background-color': '#009900',
                'color': 'white',
                'cursor': 'pointer'
            }
        }

        // if agreement was granted
        if(this.model.data.gdpr_marketing_agreement == 'r'){
            return {
                'background-color': '#cc0000',
                'color': 'white',
                'cursor': 'pointer'
            }
        }


        for(let item of this.gdprData.related ){
            if(item.gdpr_marketing_agreement == '1'){
                return {
                    'background-color': '#009900',
                    'color': 'white',
                    'cursor': 'pointer'
                }
            }
        }

        return {
            'background-color': '#cc0000',
            'color': 'white',
            'cursor': 'pointer'
        }
    }

    showDetails(){
        this.modal.openModal('ObjectGDPRModal').subscribe(modalRef => {
            modalRef.instance.gdprLog = this.gdprData.related;
        })
    }

}