/**
 * @module Admin Inspector Module
 */
import {Component, OnInit, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {configurationService} from '../../services/configuration.service';
import {modelutilities} from '../../services/modelutilities.service';


@Component({
    selector: 'administration-asset-manager',
    templateUrl: '../templates/administrationassetmanager.html'
})

export class AdministrationAssetManager implements OnInit{

    public assets: any = {
        loginimage: null,
        headerimage: null
    }

    public loadedassets: any;

    public cssvars: any = [
        {value: '', csstype: 'color', name: 'color-white'},
        {value: '', csstype: 'color', name: 'color-grey-3'},
        {value: '', csstype: 'color', name: 'color-grey-9'},
        {value: '', csstype: 'color', name: 'color-grey-13'},
        {value: '', csstype: 'color', name: 'brand-background-primary'},
        {value: '', csstype: 'color', name: 'brand-primary'},
        {value: '', csstype: 'color', name: 'brand-primary-active'},
        {value: '', csstype: 'color', name: 'brand-accessible'},
        {value: '', csstype: 'color', name: 'brand-accessible-active'},
        {value: '', csstype: 'color', name: 'brand-header-contrast-cool'},
        {value: '', csstype: 'color', name: 'brand-text-link'},
        {value: '', csstype: 'color', name: 'color-background-inverse'},
        {value: '', csstype: 'color', name: 'color-border-inverse'},
        {value: '', csstype: 'color', name: 'color-background-success'},
        {value: '', csstype: 'color', name: 'color-background-success-dark'},
        {value: '', csstype: 'color', name: 'color-text-link-active'},
        {value: '', csstype: 'color', name: 'color-progressbar_item-completed'},
        {value: '', csstype: 'color', name: 'brand-primary-transparent'},
        {value: '', csstype: 'color', name: 'color-background-alt-inverse'},
        {value: '', csstype: 'color', name: 'color-border-brand'},
        {value: '', csstype: 'color', name: 'sds-c-button-brand-color-background'},
        {value: '', csstype: 'color', name: 'sds-c-button-neutral-color-background-hover'},
        {value: '', csstype: 'color', name: 'sds-c-button-brand-color-border-hover'},
        {value: '', csstype: 'color', name: 'sds-c-button-brand-color-background-active'},
        {value: '', csstype: 'color', name: 'sds-c-button-brand-color-border-active'},
        {value: '', csstype: 'color', name: 'sds-c-button-brand-color-background-hover'},
        {value: '', csstype: 'string', name: 'sds-c-input-shadow-focus'},
        {value: '', csstype: 'string', name: 'sds-c-textarea-shadow-focus'},
        {value: '', csstype: 'string', name: 'sds-c-select-shadow-focus'},
        {value: '', csstype: 'color', name: 'sds-c-button-text-color-hover'},
        {value: '', csstype: 'color', name: 'sds-c-icon-color-foreground'}
    ]

    private assetdimensions: any = {
        loginimage: {
            cropheight: 300,
            cropwidth: 300,
            croptype: 'square',
            cropresize: false
        },
        headerimage: {
            cropheight: 50,
            cropwidth: 300,
            croptype: 'square',
            cropresize: false
        }
    }

    constructor(
        public toast: toast,
        public modal: modal,
        public backend: backend,
        public configuration: configurationService,
        public modelutilities: modelutilities,
        public injector: Injector
    ) {
    }

    /**
     * get the current set colors
     */
    public ngOnInit() {
        for(let c of this.cssvars){
            c.value = getComputedStyle(document.documentElement).getPropertyValue('--'+c.name);
            c.originalvalue = getComputedStyle(document.documentElement).getPropertyValue('--'+c.name);
        }

        this.loadSystemAssets();
    }

    private loadSystemAssets(){
        this.backend.getRequest('system/spiceui/admin/assets').subscribe(assets => {
            this.loadedassets = assets;

            // see if we have a loginimage
            let loginimage = assets.find(a => a.assetkey == 'loginimage');
            if(loginimage){
                this.assets.loginimage = loginimage.assetvalue;
            }

            // see if we have a headerimage
            let headerimage = assets.find(a => a.assetkey == 'headerimage');
            if(headerimage){
                this.assets.headerimage = headerimage.assetvalue;
            }
            let colors = assets.find(a => a.assetkey == 'colors');
            if(colors){
                let c = JSON.parse(colors.assetvalue);
                for(let tc in c){
                    let cssvar = this.cssvars.find(csv => tc);
                    if(cssvar){
                        cssvar.loadedvalue = c[tc];
                    }
                }
            }
        })
    }

    public addAsset(assetType){
        this.modal.openModal('SystemUploadImage').subscribe(modalref =>{
            modalref.instance.cropheight = this.assetdimensions[assetType].cropheight;
            modalref.instance.cropwidth = this.assetdimensions[assetType].cropwidth;
            modalref.instance.croptype = this.assetdimensions[assetType].croptype;
            modalref.instance.cropresize = this.assetdimensions[assetType].cropresize;
            modalref.instance.imagedata.subscribe(imagedata => {
                this.assets[assetType] = imagedata;
            })
        })
    }

    /**
     * composes a color label fromt eh cvar name
     * @param colorname
     */
    public colorLabel(colorname){
        return 'LBL_TC_' + colorname.toUpperCase().replace(new RegExp('-', 'g'), '_');
    }

    /**
     * returns the style for the asset as set in teh dimensions
     * @param assetType
     */
    public assetBoxStyle(assetType){
        return {width: this.assetdimensions[assetType].cropwidth, height: this.assetdimensions[assetType].cropheight};
    }

    public save(){
        // build the body
        let assets: any[] = [];

        let loginimage = this.loadedassets.find(a => a.assetkey == 'loginimage');
        assets.push({
            id: loginimage ? loginimage.id : this.modelutilities.generateGuid(),
            assetkey: 'loginimage',
            assetvalue: this.assets.loginimage
        });

        let headerimage = this.loadedassets.find(a => a.assetkey == 'headerimage');
        assets.push({
            id: headerimage ? headerimage.id : this.modelutilities.generateGuid(),
            assetkey: 'headerimage',
            assetvalue: this.assets.headerimage
        });

        // build the css values
        let colors: any = {};
        for(let cssvar of this.cssvars){
            if(cssvar.value != cssvar.originalvalue || cssvar.loadedvalue){
                colors[cssvar.name] = cssvar.value;
                document.documentElement.style.setProperty('--' + cssvar.name, cssvar.value);
                cssvar.originalvalue = cssvar.value;
            }
        }

        let lc = this.loadedassets.find(a => a.assetkey == 'colors');
        assets.push({
            id: lc ? lc.id : this.modelutilities.generateGuid(),
            assetkey: 'colors',
            assetvalue: JSON.stringify(colors)
        });

        this.backend.postRequest('system/spiceui/admin/assets', {}, assets).subscribe(res => {
            this.configuration.setAssets(res, true);
        })
    }

}

