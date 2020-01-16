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

export interface FileUploadProps {
  value?: FileInfo, // coming from Ant Design form field decorator
  onChange?: (arg: any) => void, // coming from Ant Design form field decorator
  enableFullWidth?: boolean,
  disabled?: boolean,
  uploadProps?: UploadProps,
  render?: (fileInfo: FileInfo | undefined) => React.ReactNode,
}

export interface FileInfo {
  id: string,
  name: string,
}

@observer
class FileUploadComponent extends React.Component<FileUploadProps & WrappedComponentProps> {

  @observable
  fileList: UploadFile[] = [];

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
    getCubaREST()!.getFile(this.fileList[0].uid).then((blob: Blob) => {
      const objectUrl: string = URL.createObjectURL(blob);

      const fileName: string = this.fileList[0].name;
      if (isImageFile(fileName)) {
        // Open image in a new tab
        window.open(objectUrl);
      } else {
        // Download file with correct filename
        const anchor: HTMLAnchorElement = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = fileName;
        anchor.click();
      }

      URL.revokeObjectURL(objectUrl);
    });
  };

  handleRemove = (_file: UploadFile) => {
    this.fileList = [];
    if (this.props.onChange) {
      this.props.onChange(null);
    }
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
      <Upload
        { ...uploadProps }
      >
        { this.props.render ? this.props.render(this.props.value) : <FileUploadDropArea fileInfo={this.props.value}/> }
      </Upload>
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
