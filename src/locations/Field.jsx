import React, {useState, useEffect, useRef} from 'react';
import {Paragraph} from '@contentful/f36-components';
import {useSDK, useAutoResizer} from '@contentful/react-apps-toolkit';
import Filerobot from '@filerobot/core';
import Explorer from '@filerobot/explorer';
import XHRUpload from '@filerobot/xhr-upload';
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import './Field.css';
import {createClient} from 'contentful-management'
import { Button, Modal } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';

const Field = () => {
    const sdk = useSDK();
    useAutoResizer();
    const configs = sdk.parameters.installation;
    const filerobot = useRef(null);
    const [isPublished, setIsPublished] = useState(!!sdk.entry.getSys().publishedVersion);
    const [supportedFields, setSupportedFields] = useState([])
    const [isSupport, setIsSupport] = useState(false)
    const [images, setImages] = useState({})

    useEffect(() => {
        async function fetchData() {

            const cma = createClient(
                {apiAdapter: sdk.cmaAdapter},
                {
                    type: 'plain',
                    defaults: {
                        environmentId: sdk.ids.environmentAlias ?? sdk.ids.environment,
                        spaceId: sdk.ids.space,
                    },
                }
            )
            const editorInterface = await cma.editorInterface.getMany({})
            const tempSupportedFields = []
            editorInterface.items.forEach((editor, index) => {
                editor.controls.forEach((field, fieldIndex) => {
                    if (field.widgetNamespace === 'app' && field.widgetId === sdk.ids.app) {
                        tempSupportedFields.push(field.fieldId)
                    }
                })
            })
            setSupportedFields(tempSupportedFields)
        }

        fetchData()
    }, [sdk])

    useEffect(() => {
        if (supportedFields.length > 0 && supportedFields.includes(sdk.field.id)) {
            setIsSupport(true)
        }
    }, [supportedFields, sdk])

    if (!configs.directory || configs.directory === "") {
        configs.directory = "/";
    } else if (configs.directory.charAt(0) !== "/") {
        configs.directory = `/${configs.directory}`;
    }


    useEffect(() => {
        function sysChangeHandler(value) {
            setIsPublished(!!sdk.entry.getSys().publishedVersion);
        }

        sdk.entry.onSysChanged(sysChangeHandler);
    }, [sdk]);

    useEffect(() => {
        let existingMedia = sdk.field.getValue();
        existingMedia = existingMedia ? existingMedia : {};
        if (Object.keys(existingMedia).length > 0) {
            setImages(existingMedia)
        }
        if (configs.token && configs.sectempid && isSupport) {
            console.log("#widget-"+sdk.field.id)
            const filerobotToken = configs.token;
            const filerobotSecTemp = configs.sectempid;

            filerobot.current = Filerobot({
                securityTemplateID: filerobotSecTemp,
                container: filerobotToken
            })
                .use(Explorer, {
                    config: {
                        rootFolderPath: configs.directory
                    },
                    target: "#widget-"+sdk.field.id,
                    inline: true,
                    width: '100%',
                    height: '100%',
                    disableExportButton: true,
                    hideExportButtonIcon: true,
                    preventExportDefaultBehavior: true,
                    hideUploadButton: true,
                    locale: {
                        strings: {
                            mutualizedExportButtonLabel: 'Add'
                        }
                    },
                })
                .use(XHRUpload)
                // .on('complete', async ({ failed, uploadID, successful }) => { }) // Since we used "hideUploadButton: true", on-complete is not needed
                .on('export', async (files, popupExportSucessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
                    files.forEach((item, index) => {

                        // Rid the query param: "vh"
                        let url = new URL(item.file.url.cdn);
                        let params = new URLSearchParams(url.search);
                        params.delete('vh');
                        url = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : `${url.origin}${url.pathname}`;

                        // Create an image tile
                        let uniqueId = `${Math.floor(Math.random() * 1000000000000000)}${Date.now()}`;

                        // Stored updated list of selected media to Contentful database
                        let existingMedia = sdk.field.getValue();
                        existingMedia = existingMedia ? existingMedia : {};
                        existingMedia[uniqueId] = url;
                        sdk.field.setValue(existingMedia);
                        setImages(existingMedia);
                    });
                });

            return () => {
                filerobot.current.close();
            }
        }
    }, [sdk, configs, filerobot, isSupport]);

    const removeImage = (key) => {
        let tempImages = images
        delete tempImages[key]
        setImages(tempImages)
        sdk.field.setValue(tempImages)
        console.log(tempImages)
    }

    if (!configs.token || !configs.sectempid) return <Paragraph>Please set Filerobot token and security template ID.</Paragraph>;

    return (
        <div>
            <div id={"widget-"+sdk.field.id}></div>
            <div>
                {Object.keys(images).length > 0 && (
                    <>
                        {Object.keys(images).map((key) => (
                            <div key={key}>
                                <img src={images[key]} />
                                <button onClick={() => removeImage(key)}>Remove</button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
};

export default Field;
