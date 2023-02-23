import React from 'react';
import { Paragraph } from '@contentful/f36-components';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import {Modal} from "@contentful/forma-36-react-components";

const Entry = () => {
  const sdk = useSDK();

  return <div
      style={{
        height: '800px',
        width: '1200px'
      }}
  >
    <div>
      <h onClick={function noRefCheck(){}}>
        Open modal
      </h>
      <Modal
          isShown
          modalContentProps={{
            className: 'additional-modal-content-class'
          }}
          modalHeaderProps={{
            className: 'additional-modal-header-class'
          }}
          onAfterOpen={function noRefCheck(){}}
          onClose={function noRefCheck(){}}
          size="fullWidth"
          title="Default modal"
      >
        Modal content. It is centered by default.
      </Modal>
    </div>
  </div>
};

export default Entry;
