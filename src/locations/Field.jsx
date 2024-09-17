import React, { useState, useEffect } from 'react';
import {Grid, Stack, Button, Asset, MenuItem, DragHandle, Card, AssetCard } from '@contentful/f36-components';
import * as icons from '@contentful/f36-icons';
import { /* useCMA, */ useSDK} from '@contentful/react-apps-toolkit';
import { DndContext } from '@dnd-kit/core';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
  } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from "emotion";
  
const Field = () => {
    const sdk = useSDK();
    const [assets, setAssets] = useState([])
    const styles = {
        card: css({
          // This lets us change z-index when dragging
          position: "relative",
        }),
        dragHandle: css({
          alignSelf: "stretch",
        }),
        assetCard: css({
            borderWidth: 0
        })
      };

    useEffect(() => {
        let storedAssets = sdk.field.getValue();
        storedAssets = storedAssets ? storedAssets : [];
        if (storedAssets.length > 0) setAssets(storedAssets)
        sdk.window.updateHeight(315)
    }, [sdk]);

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
                if (Array.isArray(assetItems) && assetItems.length > 0) {
                    let newAssetsList = assets.concat(assetItems)
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
        else if (type?.includes('image')) return 'image'
        else if (type?.includes('audio')) return 'audio'
        else if (type?.includes('html')) return 'markup'
        else if (type?.includes('richtext')) return 'richtext'
        else if (type?.includes('spreadsheet')) return 'spreadsheet'
        else if (type?.includes('presentation')) return 'presentation'
        else if (type?.includes('video')) return 'video'
        else if (type?.includes('code')) return 'code'
        else return 'archive'
    }

    function SortableCard({asset}) {
        const id = asset.id
        const { attributes, listeners, setNodeRef, transform, transition, active } =
          useSortable({
            id,
          });
        const zIndex = active && active.id === id ? 1 : 0;
        const style = {
          transform: CSS.Translate.toString(transform),
          transition,
          zIndex,
        };
    
        return (
            <div className=''>
                <Card
                    className={styles.card}
                    dragHandleRender={() => (
                    <DragHandle
                        as="button"
                        className={styles.dragHandle}
                        label="Move card"
                        {...attributes}
                        {...listeners}
                    />
                    )}
                    padding="none"
                    withDragHandle
                    ref={setNodeRef}
                    style={style}
                >
                    <AssetCard
                        className={styles.assetCard}
                        size="small"
                        actions={[
                            <MenuItem key="delete" onClick={() => removeAsset(asset.id)}>
                                Delete
                            </MenuItem>,
                        ]}
                        src={asset.url + "?w=150&h=150&func=fit&bg_img_fit=1&bg_opacity=0.75"}
                        type={getType(asset?.type)}
                        title={asset.name}
                    />
                </Card>
              
            </div>
        );
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;
    
        if (active && over && active.id !== over.id) {
          setAssets((assets) => {
            const assetsMapId = assets.map(e => e.id);
            const oldIndex = assetsMapId.indexOf(active.id);
            const newIndex = assetsMapId.indexOf(over.id);
            return arrayMove(assets, oldIndex, newIndex);
          });
        }
      };

    return (
        <div>
            <Stack>
                <Button variant="secondary" startIcon={<icons.AssetIcon />} size="small" onClick={() => showDAMWidget()}>
                    Asset Manager
                </Button>
                {assets.length > 0 && (
                    <Button size="small" startIcon={<icons.CloseIcon />} variant="negative" onClick={() => clearAll()}>
                        Clear all
                    </Button>
                )}
            </Stack>
            
            <Stack style={{marginTop: '20px'}}>
                <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext items={assets} strategy={horizontalListSortingStrategy}>
                        <Grid
                            style={{width: '100%'}}
                            columns="1fr 1fr 1fr 1fr"
                            rowGap="spacingM"
                            columnGap="spacingM"
                        >
                            {assets.map((asset, index) => (
                                <SortableCard key={asset.id} asset={asset} />
                            ))}
                        </Grid>
                    </SortableContext>
                </DndContext>
            </Stack>
            
        </div>
    )
};

export default Field;
