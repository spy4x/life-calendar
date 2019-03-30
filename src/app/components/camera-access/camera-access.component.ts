import {
  AfterViewInit,
  Component, ElementRef, EventEmitter, Output, ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'lc-camera-access',
  templateUrl: './camera-access.component.html',
  styleUrls: ['./camera-access.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class CameraAccessComponent implements AfterViewInit {
  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;
  @Output()
  public photoDone: EventEmitter<any> = new EventEmitter();
  public photo: any;
  public isPhotoReady = false;
  public videoStream;
  constructor() { }

  public ngAfterViewInit() {
    this.initVideoStream();
  }

  public capture() {
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.photo = this.canvas.nativeElement.toDataURL('image/png');
    this.isPhotoReady = true;
    this.stopVideo();
  }

  public newPhoto() {
    this.isPhotoReady = false;
    this.canvas.nativeElement.getContext('2d').clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.initVideoStream();
  }

  public ok() {
    this.photoDone.emit(this.photo);
  }
  private initVideoStream() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.videoStream = stream;
        try {
          this.video.nativeElement.srcObject = stream;
        } catch (error) {
          this.video.nativeElement.src = window.URL.createObjectURL(stream);
        }
        this.video.nativeElement.play();
      });
    }
  }

  private  stopVideo() {
    this.videoStream.getTracks().forEach(track => track.stop());
  }
}
