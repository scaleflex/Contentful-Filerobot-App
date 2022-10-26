import { setup } from '@contentful/dam-app-base';

const ConfigScreen = () => {
  setup({
    cta: 'Select assets',
    name: 'Scaleflex Filerobot',
    logo: 'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Favicon/FILEROBOT+favicon.ico',
    color: '#d7f0fa',
    description: 'Scaleflex Filerobot',
    parameterDefinitions: [
      // {
      //   "id": "cname",
      //   "type": "Symbol",
      //   "name": "CNAME",
      //   "description": "CNAME",
      //   "required": true
      // },
      {
        "id": "token",
        "type": "Symbol",
        "name": "Token",
        "description": "Token",
        "required": true
      },
      {
        "id": "sectempid",
        "type": "Symbol",
        "name": "Security Template ID",
        "description": "Security Template ID",
        "required": true
      },
      {
        "id": "directory",
        "type": "Symbol",
        "name": "Directory",
        "description": "Directory",
        "required": true
      }
    ],
    //validateParameters: () => null,
    makeThumbnail: asset => asset.thumbnailUrl,
    // openDialog: async (sdk, currentValue, config) => {
    //   return await sdk.dialogs.openCurrentApp({
    //     parameters: { config, currentValue },
    //   });
    // },
    isDisabled: () => false
  });
};
export default ConfigScreen;
