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
        "name": "Filerobot token",
        "description": "Filerobot token from your Filerobot account",
        "required": true
      },
      {
        "id": "sectempid",
        "type": "Symbol",
        "name": "Security Template Identifier",
        "description": "To load the Filerobot Widget or Filerobot Image Editor, you you need to create a Security Template in your Filerobot Asset Hub first, in order for your WordPress instantiation of the Filerobot Widget to obtain proper credentials and access your storage",
        "required": true
      },
      {
        "id": "directory",
        "type": "Symbol",
        "name": "Filerobot upload directory",
        "description": "The directory in your Filerobot account, where the files will be stored",
        "required": true
      }
    ],
    validateParameters: () => null,
    makeThumbnail: asset => asset.thumbnailUrl,
    openDialog: async (sdk, currentValue, config) => {
      return await sdk.dialogs.openCurrentApp({
        parameters: { config, currentValue },
      });
    },
    isDisabled: () => false
  });
};
export default ConfigScreen;
