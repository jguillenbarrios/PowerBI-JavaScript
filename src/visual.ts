import * as models from 'powerbi-models';
import { IFilterable } from './ifilterable';
import { IPageNode, Page } from './page';

export interface IVisualNode {
    name: string;
    page: IPageNode;
}

export class Visual implements IVisualNode, IFilterable {
    name: string;
    page: IPageNode;

    constructor(page: IPageNode, name: string) {
        this.name = name;
        this.page = page;
    }

    /**
     * Gets all page level filters within report
     * 
     * ```javascript
     * visual.getFilters()
     *  .then(pages => { ... });
     * ```
     */
    getFilters() {
        return this.page.report.service.hpm.get<models.IFilter[]>(`/report/pages/${this.page.name}/visuals/${this.name}/filters`, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
            .then(response => response.body,
            response => {
                throw response.body;
            });
    }

    /**
     * Remove all filters on this page within the report
     * 
     * ```javascript
     * visual.removeFilters();
     * ```
     */
    removeFilters() {
        return this.setFilters([]);
    }

    /**
     * Set all filters at the visual level of the page
     * 
     * ```javascript
     * visual.setFilters(filters)
     *  .catch(errors => { ... });
     * ```
     */
    setFilters(filters: (models.IBasicFilter | models.IAdvancedFilter)[]) {
        return this.page.report.service.hpm.put<models.IError[]>(`/report/pages/${this.page.name}/visuals/${this.name}/filters`, filters, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
            .catch(response => {
                throw response.body;
            });
    }
}