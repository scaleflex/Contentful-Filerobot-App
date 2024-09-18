import React, {useCallback, useState, useEffect} from 'react';
import {Heading, Form, Flex, Image, Text, TextInput, FormControl, Paragraph, Box, TextLink} from '@contentful/f36-components';
import { useSDK} from '@contentful/react-apps-toolkit';


const ConfigScreen = () => {
    const [parameters, setParameters] = useState({});
    const sdk = useSDK();
    const onConfigure = useCallback(async () => {
        const currentState = await sdk.app.getCurrentState();
        return {
            parameters,
            targetState: currentState,
        };
    }, [parameters, sdk]);

    useEffect(() => {
        sdk.app.onConfigure(() => onConfigure());
    }, [sdk, onConfigure]);

    useEffect(() => {
        (async () => {
            const currentParameters = await sdk.app.getParameters();
            if (currentParameters) {
                setParameters(currentParameters);
            }
            sdk.app.setReady();
        })();
    }, [sdk]);

    return (
        <>
            <Box style={{
                width: '100%',
                backgroundColor: "#155bcd",
                height: "200px"
            }}/>
            <Flex alignItems="center"
                  justifyContent="center">
                <Box
                    style={{
                        width: '800px',
                        backgroundColor: "white",
                        marginTop: "-150px",
                        marginBottom: "50px",
                        borderRadius: "5px",
                        padding: "20px",
                        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
                    }}
                >
                    <Heading fontSize="fontSizeL">About Scaleflex DAM</Heading>
                    <Paragraph>Scaleflex DAM(Filerobot) is a scalable and performance-oriented Digital Asset Management platform with integrated image and video optimizers to store, organize,
                        optimize and deliver your media assets such as images, videos, PDFs and many other brand assets fast all around the world to all device types.</Paragraph>
                    <Box style={{height: "1px", width: "100%", backgroundColor: "#d0d4d6", margin: "20px 0"}}/>
                    <Form>
                        <FormControl id="token">
                            <FormControl.Label>Token</FormControl.Label>
                            <TextInput
                                id="token"
                                name="token"
                                value={parameters?.token}
                                isRequired={true}
                                onChange={(e) => setParameters({...parameters, token: e.target.value})}
                            />
                            <Flex justifyContent="space-between">
                                <FormControl.HelpText>
                                    Scaleflex DAM token from your account, you can obtain a token by fill in
                                    <TextLink href="https://www.scaleflex.com/contact-us" target="_blank" style={{marginLeft: "3px"}}> Scaleflex contact page</TextLink> .
                                </FormControl.HelpText>
                            </Flex>
                        </FormControl>
                        <FormControl id="secTemplate">
                            <FormControl.Label>Security Template</FormControl.Label>
                            <TextInput
                                id="secTemplate"
                                name="secTemplate"
                                isRequired={true}
                                value={parameters?.secTemplate}
                                onChange={(e) => setParameters({...parameters, secTemplate: e.target.value})}
                            />
                            <Flex justifyContent="space-between">
                                <FormControl.HelpText>
                                    To load the Scaleflex DAM Widget or Scaleflex DAM Image Editor, you you need to create a Security Template in your Asset Hub first,
                                    in order for your Contenful instantiation of the Widget to obtain proper credentials and access your storage
                                </FormControl.HelpText>
                            </Flex>
                        </FormControl>
                        <FormControl id="rootDir">
                            <FormControl.Label>Asset Directory</FormControl.Label>
                            <TextInput
                                id="rootDir"
                                name="rootDir"
                                isRequired={true}
                                value={parameters?.rootDir}
                                onChange={(e) => setParameters({...parameters, rootDir: e.target.value})}
                            />
                            <Flex justifyContent="space-between">
                                <FormControl.HelpText>
                                    The directory in your Hub, where the files will be stored
                                </FormControl.HelpText>
                            </Flex>
                        </FormControl>
                        <FormControl id="limit">
                            <FormControl.Label>Limit</FormControl.Label>
                            <TextInput
                                type="number"
                                id="limit"
                                name="limit"
                                value={parameters?.limit}
                                onChange={(e) => setParameters({...parameters, limit: Number(e.target.value)})}
                            />
                            <Flex justifyContent="space-between">
                                <FormControl.HelpText>
                                    The max number of files that can be added to a single field <br/>
                                    <Text fontColor="blue500">is optional (limit for all files type ex: 3)</Text>
                                </FormControl.HelpText>
                            </Flex>
                        </FormControl>
                        <FormControl id="attributes">
                            <FormControl.Label>Attributes</FormControl.Label>
                            <TextInput
                                id="attributes"
                                name="attributes"
                                value={parameters?.attributes}
                                onChange={(e) => setParameters({...parameters, attributes: e.target.value})}
                            />
                            <Flex justifyContent="space-between">
                                <FormControl.HelpText>
                                    An array of strings containing information (JSON attributes) that you want to store in a Contentful field<br/>
                                    <Text fontColor="blue500">is optional, separate value by comma (ex: meta, tags, info)</Text>
                                </FormControl.HelpText>
                            </Flex>
                        </FormControl>
                        <FormControl id="limitType ">
                            <FormControl.Label>Limit Type(s)</FormControl.Label>
                            <TextInput
                                id="limitType"
                                name="limitType"
                                value={parameters?.limitType}
                                onChange={(e) => setParameters({...parameters, limitType: e.target.value})}
                            />
                            <Flex justifyContent="space-between">
                                <FormControl.HelpText>
                                    An Array of strings, acceptable values any/all of the following ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE'] or ['image', 'video', 'audio', 'application', 'application/zip, application/x-zip-compressed, application/vnd.rar, application/x-rar-compressed'] -- constants are preferred --.
                                    <br/>
                                    <Text fontColor="blue500">is optional, separate value by comma (ex: image, document, video, audio)</Text>
                                </FormControl.HelpText>
                            </Flex>
                        </FormControl>
                    </Form>
                </Box>
            </Flex>
            <Flex alignItems="center"
                  justifyContent="center">
                <Box style={{
                    width: "50px",
                    marginBottom: "50px"
                }}>
                    <Image
                        width="100px"
                        height="50px"
                        alt="Scaleflex DAM Logo"
                        src="https://cdn.prod.website-files.com/623086c828f7c9787009cf20/65d708d34f30f4ccb58b5ea2_logo-scaleflex.svg"
                    />
                </Box>
            </Flex>
        </>
    );
};
export default ConfigScreen;
