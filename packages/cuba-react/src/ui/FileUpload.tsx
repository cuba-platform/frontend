import {Icon, message, Upload} from 'antd';
import * as React from 'react';
import {getCubaREST} from '../app/CubaAppProvider';
import {UploadChangeParam} from 'antd/lib/upload';
import {IReactionDisposer, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import {UploadProps} from 'antd/es/upload';
import {UploadFile} from 'antd/es/upload/interface';
import './FileUpload.css';

interface Props {
  value?: FileInfo,
  onChange?: (arg: any) => void,
}

interface FileInfo {
  id: string,
  name: string,
}

@observer
export class FileUpload extends React.Component<Props> {

  @observable
  fileList: UploadFile[] = [];

  reactionDisposer!: IReactionDisposer;

  componentDidMount(): void {
    this.reactionDisposer = reaction(
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
    );
  }

  componentWillUnmount(): void {
    if (this.reactionDisposer) {
      this.reactionDisposer();
    }
  }

  handleChange = (info: UploadChangeParam): void => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1); // Limit to a single file

    if (info.file.status === 'error') {
      message.error('File upload failed');
    }

    if (info.file.status === 'done') {
      fileList[0].uid = info.file.response.id;
      fileList[0].url = '#';
      this.props.onChange!({
        id: info.file.response.id,
        name: info.file.response.name,
      });
    }

    this.fileList = [ ...fileList ];
  };

  handlePreview = (_file: UploadFile): void => {
    getCubaREST()!.getFile(this.fileList[0].uid).then((blob: Blob) => {
      let objectUrl: string = URL.createObjectURL(blob);

      const fileName: string = this.fileList[0].name;
      if (fileName.match('.*(jpg|jpeg|gif|png)$')) {
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

  handleRemove = (_file: UploadFile): boolean | void | Promise<boolean | void> => {
    this.fileList = [];
    this.props.onChange!(null);
  };

  render() {
    const uploadProps: UploadProps = {
      action: getCubaREST()!.getFileUploadURL(),
      headers: {'Authorization': 'Bearer ' + getCubaREST()!.restApiToken},
      fileList: this.fileList,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      onRemove: this.handleRemove,
    };

    return (
      <Upload
        { ...uploadProps }
        style={{
          display: 'table',
          tableLayout: 'fixed',
          width: '100%',
        }}
      >
        <FileUploadDropArea fileInfo={this.props.value}/>
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
      <div className='file-upload-drop-area'>
        <Icon className='file-upload-drop-area__icon-replace' type='upload' />
        <span className='file-upload-drop-area__text-replace'>Upload a different file by clicking or dragging file to this area</span>
      </div>
    )
    : (
      <div className='file-upload-drop-area'>
        <Icon className='file-upload-drop-area__icon-upload' type='upload' />
        <div className='file-upload-drop-area__text-upload'>Click or drag file to this area to upload</div>
      </div>
    );
}
