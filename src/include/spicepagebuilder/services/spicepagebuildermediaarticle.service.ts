import {Injectable, signal, WritableSignal} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {
    ColumnI,
    ContentElementI,
    ImageI,
    MediaArticleI,
    SectionI,
    TextI
} from "../interfaces/spicepagebuilder.interfaces";
import {configurationService} from "../../../services/configuration.service";
import {of, Subject} from "rxjs";
import {SpicePageBuilderElementColumn} from "../components/spicepagebuilderelementcolumn";

@Injectable()
export class SpicePageBuilderMediaArticleService {
    /**
     * holds the loaded articles
     */
    public loadedArticles = new Map<string, MediaArticleI>();
    /**
     * is loading flag
     */
    public isLoading: WritableSignal<boolean> = signal(false);

    constructor(private backend: backend,
                private configurationService: configurationService) {
    }

    /**
     * load media article data from backend
     * @param id
     * @param forceReload
     */
    public loadMediaArticle(id: string, forceReload?: boolean) {

        const subject = new Subject<MediaArticleI>();

        if (!id || (!forceReload && this.loadedArticles.get(id))) {
            return of();
        }

        this.isLoading.set(true);

        this.backend.get('MediaArticles', id).subscribe({
            next: (data) => {
                this.isLoading.set(false);
                data.mediafiles = Object.values(data.mediafiles.beans);
                this.loadedArticles.set(data.id, data);
                subject.next(data);
                subject.complete();
            },
            error: () => {
                this.isLoading.set(false);
                subject.next(undefined);
                subject.complete();
            }
        });

        return subject.asObservable();
    }

    /**
     * get element media article set on the direct parent column, otherwise on the section
     * if the media article is not set on the column or section, return undefined
     *
     * @param columnComponent
     */
    public getElementMediaArticle(columnComponent: SpicePageBuilderElementColumn) {

        const id: string = columnComponent.column.attributes['media-article'] ?? columnComponent.sectionComponent.section.attributes['media-article'];

        if (id && this.loadedArticles.has(id)) {
            return of(this.loadedArticles.get(id));
        } else {
            return this.loadMediaArticle(id);
        }
    }

    /**
     * reload article data and refill the article parts with content
     * @param id
     * @param sectionOrColumn
     */
    public reloadAndRefill(id: string, sectionOrColumn: SectionI | ColumnI) {
        this.loadMediaArticle(id, true).subscribe(() => {
            this.fillInArticleParts(id, sectionOrColumn);
        });
    }

    /**
     * fill in article parts with content
     * @param id
     * @param columnOrSection
     */
    public fillInArticleParts(id: string, columnOrSection: ColumnI | SectionI) {

        if (!this.loadedArticles.get(id)) return;

        const fillInColumnChildren = (column: ColumnI) => {

            column.children.forEach((contentElement: ContentElementI) => {
                if (!contentElement.attributes['media-article-part']) return;
                const [type, value] = contentElement.attributes['media-article-part'].split('.');

                switch (type) {
                    case 'article':
                        (contentElement as TextI).content = this.loadedArticles.get(id)[value];

                        break;
                    case 'media_article_image_size':
                        const mediaFileConfig: {
                            public_url: string
                        } = this.configurationService.getCapabilityConfig('mediafiles');
                        const mediaFile = this.loadedArticles.get(id).mediafiles.find(f => f.media_article_image_size == value);

                        (contentElement as ImageI).attributes.src = !mediaFile ? null : mediaFileConfig.public_url + mediaFile.id;

                        break;
                }
            });
        };
        if (columnOrSection.tagName === 'section') {
            (columnOrSection as SectionI).children.forEach((column: ColumnI) => {
                fillInColumnChildren(column);
            });
        } else if (columnOrSection.tagName === 'column') {
            fillInColumnChildren(columnOrSection as ColumnI);
        }
    }

}