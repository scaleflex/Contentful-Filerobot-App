import React, {useState, useEffect} from 'react';
import {Grid, Box, Stack, Button, Asset} from '@contentful/f36-components';
import * as icons from '@contentful/f36-icons';
import {useSDK, useAutoResizer} from '@contentful/react-apps-toolkit';
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import './Field.css';

const Field = () => {
    const sdk = useSDK();
    useAutoResizer();
    const [assets, setAssets] = useState([])

    useEffect(() => {
        let storedAssets = sdk.field.getValue();
        storedAssets = storedAssets ? storedAssets : [];
        if (storedAssets.length > 0) {
            setAssets(storedAssets)
        }
    }, [sdk]);

    const showFilerobotWidget = () => {
        sdk.dialogs
            .openCurrentApp({
                title: "Filerobot by Scaleflex",
                width: 750,
                minHeight: 500,
                allowHeightOverflow: true,
                shouldCloseOnOverlayClick: true,
                shouldCloseOnEscapePress: true,
            })
            .then((assetsFromWidget) => {
                if (Array.isArray(assetsFromWidget) && assetsFromWidget.length > 0) {
                    let newAssetsList = assets.concat(assetsFromWidget)
                    setAssets(newAssetsList)
                    sdk.field.setValue(newAssetsList).then((data) => sdk.entry.save())
                }
            });
    }

    const removeAsset = (assetId) => {
        let filteredAssets = assets.filter((asset, index) => asset.id !== assetId)
        setAssets(filteredAssets)
        sdk.field.setValue(filteredAssets).then((data) => sdk.entry.save())
    }

    const clearAll = () => {
        setAssets([])
        sdk.field.removeValue().then((data) => sdk.entry.save())
    }

    const getType = (type) => {
        if (type?.includes('pdf')) return 'pdf'
        else if (type?.includes('text')) return 'plaintext'
        else if (type?.includes('audio')) return 'audio'
        else if (type?.includes('html')) return 'markup'
        else if (type?.includes('richtext')) return 'richtext'
        else if (type?.includes('spreadsheet')) return 'spreadsheet'
        else if (type?.includes('presentation')) return 'presentation'
        else if (type?.includes('video')) return 'video'
        else if (type?.includes('code')) return 'code'
        else return 'archive'
    }

    return (
        <>
            <Stack flexDirection="column">
                {assets.length > 0 && (
                    <Grid
                        style={{width: '100%'}}
                        columns="1fr 1fr 1fr"
                        rowGap="spacingM"
                        columnGap="spacingM"
                    >
                        {assets.map((asset, index) => (
                            <Grid.Item key={index} style={{
                                zIndex: '1',
                                padding: '8px',
                                width: '200px',
                                height: '200px',
                                position: 'relative'
                            }}>
                                <Box style={{borderRadius: '5px', padding: '5px', border: '1px solid lightgray'}}>
                                    <icons.DeleteIcon
                                        variant="secondary"
                                        style={{
                                            zIndex: '9999',
                                            position: 'absolute',
                                            bottom: '0',
                                            right: '0',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => removeAsset(asset.id)}/>
                                    {asset?.type?.includes('image') && (
                                        <img style={{borderRadius: '5px'}} src={asset.url + "?width=180&height=180"}
                                             alt={asset.id}/>
                                    )}
                                    {!asset?.type?.includes('image') && (
                                        <Asset
                                            style={{width: '180px', height: '180px'}}
                                            src={asset.url}
                                            title={asset.name}
                                            type={getType(asset?.type)}
                                        />
                                    )}
                                </Box>
                            </Grid.Item>
                        ))}
                    </Grid>
                )}
            </Stack>
            <Stack style={{marginTop: '20px'}}>
                <Button variant="secondary" startIcon={<icons.AssetIcon />} size="small" onClick={() => showFilerobotWidget()}>
                    Asset Manager
                </Button>
                {assets.length > 0 && (
                    <Button size="small" startIcon={<icons.CloseIcon />} variant="negative" onClick={() => clearAll()}>
                        Clear all
                    </Button>
                )}
            </Stack>
        </>
    )
};

export default Field;
