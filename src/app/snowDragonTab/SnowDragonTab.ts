import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/snowDragonTab/index.html")
@PreventIframe("/snowDragonTab/config.html")
@PreventIframe("/snowDragonTab/remove.html")
export class SnowDragonTab {
}
