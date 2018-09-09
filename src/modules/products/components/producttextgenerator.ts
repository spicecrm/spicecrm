import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';


declare var moment: any;

@Component({
    selector: 'product-text-generator',
    templateUrl: './app/modules/products/templates/producttextgenerator.html'
})
export class ProductTextGenerator {

    componentSubscriptions: Array<any> = [];
    attributes: any = {};
    ltattributes: any = {};
    productnames: Array<any> = [];
    attributesproductid: string = '';
    loading: boolean = false;
    tableguid: string = '';
    isOpen: boolean = true;
    E1: string = '';
    E2: string = '';
    Q: string = '';

    textElements = {
        MGST: '',
        E1: '',
        E2: '',
        Q: '',
        F: '',
        A: '',
        S: '',
    }

    get e1() {
        return this.textElements.E1;
    }

    set e1(value) {
        this.textElements.E1 = value;
    }

    textTemplateDef = [
        {
            source: 'MGST',
            len: 6
        },
        {
            source: 'E1',
            len: 4
        },
        {
            source: 'E2',
            len: 4
        },
        {
            source: 'Q',
            len: 4
        },
        {
            source: 'F',
            len: 4
        },
        {
            source: 'A',
            len: 15
        },
        {
            source: 'S',
            len: 3
        },
    ]

    textTemplate: string = 'MGST:1:6::E1:7:10::E2:11:14::Q:15:18::F:19:22::A:23:37::S:38:40';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private view: view) {
        this.componentSubscriptions.push(model.data$.subscribe(event => {
                this.loadAttributes();
            })
        );

        this.tableguid = this.model.generateGuid();
    }

    ngOnInit() {
        this.loadAttributes();
    }


    ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    loadAttributes() {
        if (this.model.data.product_id && this.model.data.product_id !== this.attributesproductid) {
            this.loading = true;
            this.attributesproductid = this.model.data.product_id;
            this.backend.getRequest('products/' + this.model.data.product_id + '/productattributes/textgenerator').subscribe((response: any) => {
                this.attributes = response.attributes;
                this.ltattributes = response.ltattributes;
                this.productnames = response.productnames;
                this.textElements.MGST = response.shorttext.substr(6, 6);
                this.loading = false;
            })
        } else if (!this.model.data.product_id) {
            this.attributes = [];
        }
    }

    translateAttribValue(attrib, value) {
        if (this.attributes[attrib].values && this.attributes[attrib].values[value])
            return this.attributes[attrib].values[value];
        else
            return value;
    }

    togglerequired() {
        this.isOpen = !this.isOpen;
    }

    getOpenStyle() {
        if (!this.isOpen)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

    get productText() {
        let producttext = '';
        for (let textElement of this.textTemplateDef) {
            let element = '';
            switch (textElement.source) {
                case 'E1':
                case 'E2':
                case 'Q':
                    if (this.textElements[textElement.source]) {
                        element = this.getAttributeValue(this.textElements[textElement.source]);

                        // handle specific datatypes
                        switch (this.attributes[this.textElements[textElement.source]].prat_datatype) {
                            case 'N':
                                element = element.toString();
                                while (element.length < 4)
                                    element = '0' + element;
                                break;
                            case 'S':
                            case 'D':
                                element = this.translateAttribValue(this.textElements[textElement.source], element);
                                break;
                        }
                    }
                    break;
                case 'F':
                    for (let attrib in this.attributes) {
                        if (this.attributes[attrib].contentcode == 'F') {
                            let attribvalue = this.getAttributeValue(attrib);
                            if (this.attributes[attrib].contentcode2 == 'D' && attribvalue) {
                                element = 'DRUC'
                            } else if (attribvalue && element === '') {
                                element = this.translateAttribValue(attrib, attribvalue);
                            }
                        }
                    }
                    break;
                case 'A':
                    let dimAttribs = [];

                    // get all attribs
                    for (let attrib in this.attributes) {
                        if (this.attributes[attrib].contentcode == 'A') {
                            let attribvalue = this.getAttributeValue(attrib);
                            if(attribvalue) {
                                switch (this.attributes[attrib].prat_datatype) {
                                    case 'N':
                                        attribvalue = attribvalue.toString();
                                        while (attribvalue.length < 4)
                                            attribvalue = '0' + attribvalue;
                                        break;
                                    case 'S':
                                    case 'D':
                                        attribvalue = this.translateAttribValue(attrib, attribvalue);
                                        break;
                                }
                                dimAttribs.push({
                                    position: this.attributes[attrib].contentcode2,
                                    value: (this.attributes[attrib].contentprefix ? this.attributes[attrib].contentprefix : '') + attribvalue
                                });
                            }
                        }
                    }

                    // sort the attribs by sequence
                    dimAttribs.sort((a, b) => {
                        return a.position > b. position ? 1 : -1;
                    });

                    // buiol the text element
                    for(let attrib of dimAttribs){
                        element += attrib.value
                    }

                    break;
                default:
                    element = this.textElements[textElement.source];
                    break;
            }

            // fill value up with slashes
            if (element.length == textElement.len) {
                producttext += element
            } else if (element.length > textElement.len) {
                producttext += element.substr(0, textElement.len);
            } else {
                while (element.length < textElement.len)
                    element += '/';
                producttext += element
            }

        }

        return producttext;
    }

    get longText(){
        let longtext = '';

        for(let attrib of this.ltattributes){
            let attribvalue = this.getAttributeValue(attrib.id);
            if(attribvalue != ''){
                longtext += attrib.textpattern.replace('[value]', attribvalue) + '\n';
            }
        }

        return longtext;
    }

    getAttributeValue(attributeid) {
        let value = '';

        try {
            for (let attrib in this.model.data.productattributevalues.beans) {
                if (this.model.data.productattributevalues.beans[attrib].productattribute_id == attributeid) {
                    return this.model.data.productattributevalues.beans[attrib].pratvalue
                }
            }
        } catch (e) {
            return '';
        }

        return value;
    }

    getvalues(type) {
        let values = [];

        for (let attribute in this.attributes) {
            if (this.attributes[attribute].contentcode == type) {
                values.push({
                    id: this.attributes[attribute].id,
                    name: this.attributes[attribute].name
                })
            }
        }

        return values;
    }

}