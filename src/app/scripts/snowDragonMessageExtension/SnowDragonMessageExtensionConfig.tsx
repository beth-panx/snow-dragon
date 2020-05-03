import * as React from "react";
import { Provider, Flex, Header, Checkbox, Button } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * State for the SnowDragonMessageExtensionConfig React component
 */
export interface ISnowDragonMessageExtensionConfigState extends ITeamsBaseComponentState {
    onOrOff: boolean;
}

/**
 * Properties for the SnowDragonMessageExtensionConfig React component
 */
export interface ISnowDragonMessageExtensionConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the Snow Dragon Message Extension configuration page
 */
export class SnowDragonMessageExtensionConfig extends TeamsBaseComponent<ISnowDragonMessageExtensionConfigProps, ISnowDragonMessageExtensionConfigState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));
        this.setState({
            onOrOff: true
        });

        microsoftTeams.initialize();
        microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true}>
                    <Flex.Item>
                        <div>
                            <Header content="Snow Dragon Message Extension configuration" />
                            <Checkbox
                                label="On or off?"
                                toggle
                                checked={this.state.onOrOff}
                                onChange={() => { this.setState({ onOrOff: !this.state.onOrOff }); }} />
                            <Button onClick={() =>
                                microsoftTeams.authentication.notifySuccess(JSON.stringify({
                                    setting: this.state.onOrOff
                                }))} primary>OK</Button>
                        </div>
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
