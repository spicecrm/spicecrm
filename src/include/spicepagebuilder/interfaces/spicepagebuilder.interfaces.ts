import {SafeResourceUrl} from "@angular/platform-browser";

/**
 * container element to be rendered in the view
 */
export interface TagElementI {
    tagName: string;
    attributes: any;
    children: any[];
}
/**
 * body element that will be rendered in the view
 * More details: https://mjml.io/documentation/#mj-body
 */
export interface BodyI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'width'?: string,
        'css-class'?: string
    };
}
/**
 * section element to be rendered in the view
 * More details: https://mjml.io/documentation/#mj-section
 */
export interface SectionI extends TagElementI {
    attributes: {
        'background-color'?: string;
        'color'?: string;
        'padding'?: string;
        'css-class'?: string;
        'border'?: string;
        'border-top'?: string;
        'border-right'?: string;
        'border-bottom'?: string;
        'border-left'?: string;
        'background-position'?: string;
        'background-repeat'?: string;
        'background-size'?: string;
        'background-url'?: string;
    };
}
/**
 * custom element predefined by user
 */
export interface CustomElement {
    id?: string,
    name: string,
    type: 'section' | 'item',
    content: SectionI | ContentElementI,
    image?: number
}
/**
 * column element to be rendered in the view
 * More details: https://mjml.io/documentation/#mj-column
 */
export interface ColumnI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'width'?: string,
        'vertical-align'?: string,
        'padding'?: string,
        'css-class'?: string
    };
}
/**
 * content element to be rendered in the view
 */
export interface ContentElementI {
    label?: string,
    tagName: string;
    attributes: any;
}
/**
 * divider element to be rendered in the view
 */
export interface DividerI extends ContentElementI {
    attributes: {
        'container-background-color'?: string,
        'border-color'?: string,
        'border-style'?: string,
        'border-width'?: string,
        'padding'?: string,
        'css-class'?: string,
        'width'?: string,
        align?: string
    };
}
/**
 * button element to be rendered in the view
 */
export interface ButtonI extends ContentElementI {
    content: string;
    trackingLink?: string,
    trackByMethod?: 'url' | 'id',
    attributes: {
        'href': string,
        'align': string,
        'background-color'?: string,
        'container-background-color'?: string,
        'color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'height'?: string,
        'padding'?: string,
        'inner-padding'?: string,
        'text-align'?: string,
        'vertical-align'?: string,
        'css-class'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'letter-spacing'?: string,
        'line-height'?: string,
        'rel'?: string,
        'target'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'width'?: string
    };
}
/**
 * button element to be rendered in the view
 */
export interface RSSI extends ContentElementI {
    content: string;
    href: string,
    count: string,
    showDate: '1' | '0',
    children: [{tagName: 'column', children: SectionI[]}],
    attributes: {
        'count': string,
        'href': string,
        'background-color'?: string,
        'color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'height'?: string,
        'padding'?: string,
        'text-align'?: string,
        'css-class'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'letter-spacing'?: string,
        'line-height'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'width'?: string
    };
}
/**
 * image element to be rendered in the view
 */
export interface ImageI extends ContentElementI {
    attributes: {
        href?: string,
        align?: string,
        alt?: string,
        src: string,
        title?: string,
        border?: string,
        'border-radius'?: string,
        'container-background-color'?: string,
        height?: string,
        padding?: string,
        'css-class'?: string,
        'fluid-on-mobile'?: 'true' | 'false',
        rel?: string,
        srcset?: string,
        target?: string,
        width?: string
    };
}

export interface ImageUrlI extends ImageI {
    content: string
}
/**
 * spacer element to be rendered in the view
 */
export interface SpacerI extends ContentElementI {
    attributes: {
        'container-background-color'?: string,
        'height': string,
        'padding': string,
        'css-class': string,
        'vertical-align': string,
        'width'?: string
    };
}
/**
 * text element to be rendered in the view
 */
export interface TextI extends ContentElementI {
    content: string;
    attributes: {
        'color'?: string,
        'container-background-color'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'line-height'?: string,
        'letter-spacing'?: string,
        'height'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'align'?: string,
        'padding'?: string,
        'css-class'?: string,
        'line-height-auto'?: boolean;
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface HTMLCodeI extends ContentElementI {
    content: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface SocialMediaI extends TagElementI {
    children: SocialMediaElementI[];
    attributes: {
        'attribute'?: string,
        'align'?: string,
        'border-radius'?: string,
        'color'?: string,
        'css-class'?: string,
        'container-background-color'?: string,
        'font-family'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'icon-height'?: string,
        'icon-size'?: string,
        'inner-padding'?: string,
        'line-height'?: string,
        'mode'?: 'vertical' | 'horizontal',
        'padding'?: string,
        'padding-bottom'?: string,
        'padding-left'?: string,
        'padding-right'?: string,
        'padding-top'?: string,
        'icon-padding'?: string,
        'text-padding'?: string,
        'text-decoration'?: string,
    }
}
/**
 * spacer element to be rendered in the view
 */
export interface SocialMediaElementI extends ContentElementI {
    content: string;
    attributes: {
        'src': string;
        'href': string;
        'align'?: string;
        'alt'?: string;
        'background-color'?: string;
        'border-radius'?: string;
        'color'?: string;
        'css-class'?: string;
        'font-family'?: string;
        'font-size'?: string;
        'font-style'?: string;
        'font-weight'?: string;
        'icon-height'?: string;
        'icon-size'?: string;
        'line-height'?: string;
        'name'?: string;
        'padding'?: string;
        'padding-bottom'?: string;
        'padding-left'?: string;
        'padding-right'?: string;
        'padding-top'?: string;
        'icon-padding'?: string;
        'icon-position'?: string;
        'text-padding'?: string;
        'sizes'?: string;
        'srcset'?: string;
        'rel'?: string;
        'target'?: string;
        'title'?: string;
        'text-decoration'?: string;
        'vertical-align'?: string;
    }
}
/**
 * available panel element
 */
export interface PanelElementI extends ContentElementI {
    icon: string;
    label: string;
    content?: string;
    count?: string,
    href?: string,
    showDate?: '0' | '1',
    children?: ContentElementI|SectionI|ColumnI[]
}
/**
 * spacer element to be rendered in the view
 */
export interface EditorAttributeI {
    name: string;
    type: string;
    label?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface AttributeObjectI {
    name: string;
    type: 'color'|'text'|'sides'|'padding'|'textSuffix'|'width'|'halign'|'valign'|'textdecoration'|'texttransform'|'border'|'borders'|'fontstyle'|'fontweight'|'direction' | 'options';
    class?: string;
    options?: {value: string, label?: string}[]
}

export interface StylesheetObjI {
    fieldName: string;
    id: string;
    content?: string;
    contentResourceUrl?: string;
    contentSafeResourceUrl?: SafeResourceUrl
}







































































