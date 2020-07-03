import React from 'react';
import {Modal} from 'antd';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import {Spinner} from './Spinner';
import './ImagePreview.less';
import {saveFile} from '../util/files';
import {ButtonProps} from 'antd/es/button';
import { DownloadOutlined } from '@ant-design/icons';

export interface ImagePreviewProps extends WrappedComponentProps {
  /**
   * Whether the modal with image preview is displayed
   */
  isVisible: boolean;
  /**
   * When true a spinner will displayed in place of the image
   */
  isLoading: boolean;
  /**
   * An object URL representing the image.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL documentation} for object URL.
   */
  objectUrl?: string;
  /**
   * A file name that will be used when downloading the file.
   */
  fileName?: string;
  /**
   * A callback that will be executed when the modal is closed.
   */
  onClose: () => void;
}

class ImagePreviewComponent extends React.Component<ImagePreviewProps> {
  get okButtonProps(): ButtonProps {
    const {isLoading} = this.props;
    return {
      disabled: isLoading,
      icon: <DownloadOutlined />
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