import {Icon, message, Upload} from 'antd';
import * as React from 'react';
import {UploadChangeParam} from 'antd/lib/upload';
import {IReactionDisposer, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import {UploadProps} from 'antd/es/upload';
import {UploadFile} from 'antd/es/upload/interface';
import './FileUpload.less';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import { getCubaREST } from '@cuba-platform/react-core';
import {ImagePreview} from './ImagePreview';
import {saveFile} from '../util/files';

export interface FileUploadProps {
  /**
   * Сoming from antd Form field decorator
   */
  value?: FileInfo,
  /**
   * Сoming from antd Form field decorator
   */
  onChange?: (arg: any) => void,
  /**
   * Whether the component shall take all available width. **Default**: true.
   */
  enableFullWidth?: boolean,
  disabled?: boolean,
  /**
   * UploadProps object that is passed through to the underlying antd {@link https://3x.ant.design/components/upload/ Upload} component
   */
  uploadProps?: UploadProps,
  /**
   * Render function that allows to customize the file drop area.
   * @param fileInfo - a valid {@link FileInfo} object
   */
  render?: (fileInfo: FileInfo | undefined) => React.ReactNode,
}

export interface FileInfo {
  /**
   * FileDescriptor id
   */
  id: string,
  /**
   * File name
   */
  name: string,
}

@observer
class FileUploadComponent extends React.Component<FileUploadProps & WrappedComponentProps> {

  @observable
  fileList: UploadFile[] = [];
  @observable isPreviewVisible = false;
  @observable isPreviewLoading = false;
  @observable previewImageObjectUrl: string | undefined;
  @observable previewFileName: string | undefined;

  reactionDisposers: IReactionDisposer[] = [];

  static defaultProps = {
    enableFullWidth: true
  };

  componentDidMount(): void {
    this.reactionDisposers.push(reaction(
      () => this.props.value,
      () => {
        if (this.props.value) {
          this.fileList = [{
            uid: this.props.value.id,
            name: this.props.value.name,
            size: 0,
            type: '',
            url: '#',
          }];
        }
      }
    ));
  }

  componentWillUnmount(): void {
    this.reactionDisposers.forEach(disposer => disposer());
    if (this.previewImageObjectUrl != null) {
      URL.revokeObjectURL(this.previewImageObjectUrl);
    }
  }

  handleChange = (info: UploadChangeParam): void => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1); // Limit to a single file

    if (info.file.status === 'error') {
      message.error(this.props.intl.formatMessage({id: 'cubaReact.fileUpload.uploadFailed'}));
    }

    if (info.file.status === 'done') {
      fileList[0].uid = info.file.response.id;
      fileList[0].url = '#';
      if (this.props.onChange) {
        this.props.onChange({
          id: info.file.response.id,
          name: info.file.response.name,
        });
      }
    }

    this.fileList = [ ...fileList ];
  };

  handlePreview = (_file: UploadFile): void => {
    const {intl} = this.props;

    const fileName: string = this.fileList[0].name;
    if (isImageFile(fileName)) {
      // Open image in ImagePreview component
      this.isPreviewVisible = true;
      this.isPreviewLoading = true;
      this.previewFileName = fileName;
      getCubaREST()!.getFile(this.fileList[0].uid).then((blob: Blob) => {
        this.previewImageObjectUrl = URL.createObjectURL(blob);
      }).catch(() => {
        message.error(intl.formatMessage({id: 'cubaReact.file.downloadFailed'}));
        this.isPreviewVisible = false;
      }).finally(() => {
        this.isPreviewLoading = false;
      });
    } else {
      // Download file with correct filename
      const hideDownloadMessage = message.loading(intl.formatMessage({id: 'cubaReact.file.downloading'}));
      getCubaREST()!.getFile(this.fileList[0].uid).then((blob: Blob) => {
        const objectUrl: string = URL.createObjectURL(blob);
        saveFile(objectUrl, fileName);
        URL.revokeObjectURL(objectUrl);
      }).catch(() => {
        message.error(intl.formatMessage({id: 'cubaReact.file.downloadFailed'}));
      }).finally(() => {
        hideDownloadMessage();
      });
    }
  };

  handleRemove = (_file: UploadFile) => {
    this.fileList = [];
    if (this.props.onChange) {
      this.props.onChange(null);
    }
  };

  handleClosePreview = () => {
    this.isPreviewVisible = false;
    if (this.previewImageObjectUrl) {
      URL.revokeObjectURL(this.previewImageObjectUrl);
    }
    this.previewImageObjectUrl = undefined;
    this.previewFileName = undefined;
  };

  render() {
    const defaultUploadProps: UploadProps = {
      action: getCubaREST()!.getFileUploadURL(),
      headers: {'Authorization': 'Bearer ' + getCubaREST()!.restApiToken},
      fileList: this.fileList,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      onRemove: this.handleRemove,
      disabled: this.props.disabled,
      showUploadList: {
        showDownloadIcon: false,
        showPreviewIcon: true,
        showRemoveIcon: true,
      },
      className: this.props.enableFullWidth ? '_cuba-file-upload-full-width-enabled' : '',
    };

    const uploadProps: UploadProps = { ...defaultUploadProps, ...this.props.uploadProps };

    return (
      <>
        <Upload
          { ...uploadProps }
        >
          { this.props.render ? this.props.render(this.props.value) : <FileUploadDropArea fileInfo={this.props.value}/> }
        </Upload>
        <ImagePreview isVisible={this.isPreviewVisible}
                      isLoading={this.isPreviewLoading}
                      objectUrl={this.previewImageObjectUrl}
                      fileName={this.previewFileName}
                      onClose={this.handleClosePreview}
        />
      </>
    );
  };

}

interface FileUploadDropAreaProps {
  fileInfo: FileInfo | undefined;
}

function FileUploadDropArea(props: FileUploadDropAreaProps) {
  return props.fileInfo
    ? (
      <div className='cuba-file-drop-area'>
        <Icon className='replaceicon' type='upload' />
        <span className='replacetext'>
          <FormattedMessage id='cubaReact.fileUpload.replace'/>
        </span>
      </div>
    )
    : (
      <div className='cuba-file-drop-area'>
        <Icon className='uploadicon' type='upload' />
        <div className='uploadtext'>
          <FormattedMessage id='cubaReact.fileUpload.upload'/>
        </div>
      </div>
    );
}

function isImageFile(fileName: string): boolean {
  return !!fileName.match('.*(jpg|jpeg|gif|png)$');
}

const fileUpload =
  injectIntl(
    FileUploadComponent
  );

export {fileUpload as FileUpload};
