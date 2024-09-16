import React from 'react';
import {Grid, Box, Stack, Button, Asset} from '@contentful/f36-components';
import * as icons from '@contentful/f36-icons';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';

const Field = () => {
    const sdk = useSDK();

    const showDAMWidget = () => {
        sdk.dialogs
            .openCurrentApp({
                title: "Scaleflex DAM",
                width: 'fullWidth',
                position: 'top',
                minHeight: 700,
                allowHeightOverflow: true,
                shouldCloseOnOverlayClick: true,
                shouldCloseOnEscapePress: true,
            })
            .then((assetItems) => {
                console.log(assetItems);
            });
    }

    return <>
        <Stack style={{marginTop: '20px'}}>
            <Button variant="secondary" startIcon={<icons.AssetIcon/>} size="small" onClick={() => showDAMWidget()}>
                Asset Manager
            </Button>
        </Stack>
    </>;
};

export default Field;
