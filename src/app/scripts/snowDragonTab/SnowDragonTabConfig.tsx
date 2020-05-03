import * as React from "react";
import { Provider, Flex, Header, Input } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export interface ISnowDragonTabConfigState extends ITeamsBaseComponentState {
    value: string;
}

export interface ISnowDragonTabConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of Snow Dragon Tab configuration page
 */
export class SnowDragonTabConfig  extends TeamsBaseComponent<ISnowDragonTabConfigProps, ISnowDragonTabConfigState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));

        if (this.inTeams()) {
            microsoftTeams.initialize();

            microsoftTeams.getContext((context: microsoftTeams.Context) => {
                this.setState({
                    value: context.entityId
                });
                this.updateTheme(context.theme);
                this.setValidityState(true);
            });

            microsoftTeams.settings.registerOnSaveHandler((saveEvent: microsoftTeams.settings.SaveEvent) => {
                // Calculate host dynamically to enable local debugging
                const host = "https://" + window.location.host;
                microsoftTeams.settings.setSettings({
                    contentUrl: host + "/snowDragonTab/?data=",
                    websiteUrl: host + "/snowDragonTab/?data=",
                    suggestedDisplayName: "Snow Dragon Tab",
                    removeUrl: host + "/snowDragonTab/remove.html",
                    entityId: this.state.value
                });
                saveEvent.notifySuccess();
            });
        } else {
        }
    }

    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true}>
                    <Flex.Item>
                        <div>
                            <Header content="Configure your tab" />
                            <Input
                                placeholder="Enter a value here"
                                fluid
                                clearable
                                value={this.state.value}
                                onChange={(e, data) => {
                                    if (data) {
                                        this.setState({
                                            value: data.value
                                        });
                                    }
                                }}
                                required />
                        </div>
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
