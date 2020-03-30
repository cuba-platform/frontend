import React from 'react';
import {Modal} from 'antd';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import {Spinner} from './Spinner';
import './ImagePreview.less';
import {saveFile} from '../util/files';
import {ButtonProps} from 'antd/es/button';

type Props = WrappedComponentProps & {
  isVisible: boolean;
  isLoading: boolean;
  objectUrl?: string;
  fileName?: string;
  onClose: () => void;
}

class ImagePreviewComponent extends React.Component<Props> {
  get okButtonProps(): ButtonProps {
    const {isLoading} = this.props;
    return {
      disabled: isLoading,
      icon: 'download'
    }
  }

  saveFile = () => {
    const {objectUrl, fileName} = this.props;
    if (objectUrl != null && fileName != null) {
      saveFile(objectUrl, fileName);
    }
  };

  render() {
    const {intl, isVisible, isLoading, objectUrl, fileName, onClose} = this.props;

    return (
      <Modal title={intl.formatMessage({id: 'cubaReact.imagePreview.title'})}
             visible={isVisible}
             afterClose={onClose}
             onCancel={onClose}
             onOk={this.saveFile}
             cancelText={intl.formatMessage({id: 'cubaReact.imagePreview.close'})}
             okText={intl.formatMessage({id: 'cubaReact.imagePreview.download'})}
             okButtonProps={this.okButtonProps}
             destroyOnClose={true}
             width='80vw'
      >
        {isLoading && (
          <div className='image-preview-spinner'>
            <Spinner/>
          </div>
        )}
        {!isLoading && objectUrl != null && fileName != null && (
          <div className='image-preview'>
            <div className='title'>
              {fileName}
            </div>
            <img src={objectUrl}
                 alt={intl.formatMessage({id: 'cubaReact.imagePreview.alt'})}
                 className='image'
            />
          </div>
        )}
      </Modal>
    );
  }
}

const component = injectIntl(ImagePreviewComponent);

export {component as ImagePreview};