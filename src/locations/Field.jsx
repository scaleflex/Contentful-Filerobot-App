import React, {useState, useEffect} from 'react';
import {Grid, Box, Stack, Button} from '@contentful/f36-components';
import * as icons from '@contentful/f36-icons';
import {useSDK, useAutoResizer} from '@contentful/react-apps-toolkit';
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import './Field.css';

const Field = () => {
    const sdk = useSDK();
    useAutoResizer();
    const [images, setImages] = useState([])

    useEffect(() => {
        let existingMedia = sdk.field.getValue();
        existingMedia = existingMedia ? existingMedia : [];
        if (existingMedia.length > 0) {
            setImages(existingMedia)
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
            .then((imageFromWidget) => {
                setImages([...images, ...imageFromWidget])
                sdk.field.setValue(imageFromWidget).then((data) => sdk.entry.save())
            });
    }

    const removeImage = (imageId) => {
        setImages(images.filter((image, index) => image.id !== imageId))
        sdk.field.removeValue().then((data) => sdk.entry.save())
    }

    const clearAll = () => {
        setImages([])
        sdk.field.setValue(null).then((data) => sdk.entry.save())
    }

    return (
        <>
            <Stack flexDirection="column">
                {images.length > 0 && (
                    <Grid
                        style={{width: '100%'}}
                        columns="1fr 1fr 1fr"
                        rowGap="spacingM"
                        columnGap="spacingM"
                    >
                        {images.map((image, index) => (
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
                                        onClick={() => removeImage(image.id)}/>
                                    <img style={{borderRadius: '5px'}} src={image.url + "?width=180&height=180"}
                                         alt={image.id}/>
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
                {images.length > 0 && (
                    <Button size="small" startIcon={<icons.CloseIcon />} variant="negative" onClick={() => clearAll()}>
                        Clear all
                    </Button>
                )}
            </Stack>
        </>
    )
};

export default Field;
