import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { sleep } from '../../../services/sleep.helper';
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lc-welcome-camera',
  templateUrl: './camera.component.pug',
  styleUrls: ['./camera.component.sass'],
})
export class CameraComponent implements AfterViewInit, OnDestroy {
  @Output() done = new EventEmitter<string | null>();
  @ViewChild('video')
  public video: ElementRef;
  @ViewChild('canvas')
  public canvas: ElementRef;
  @ViewChild('photo')
  public photo: ElementRef;
  @Output()
  photoDataUrl: string;
  isPhotoReady = false;
  videoStream: MediaStream;
  timerSecondsLeft;

  width = 320;    // We will scale the photo width to this
  height = 0;     // This will be computed based on the input stream
  isStreaming = false;
  isSupported = true;

  ngAfterViewInit() {
    this.initVideoStream();
  }

  ngOnDestroy(): void {
    this.stopVideo();
  }

  public newPhoto() {
    this.isPhotoReady = false;
  }

  public ok() {
    this.done.emit(this.photoDataUrl);
  }

  takePicture() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (this.width && this.height) {
      this.canvas.nativeElement.width = this.width;
      this.canvas.nativeElement.height = this.height;
      context.drawImage(this.video.nativeElement, 0, 0, this.width, this.height);

      this.photoDataUrl = this.canvas.nativeElement.toDataURL('image/png');
      this.photo.nativeElement.setAttribute('src', this.photoDataUrl);
    } else {
      this.clearPhoto();
    }
    this.isPhotoReady = true;
    new Audio('/assets/camera_shutter.wav').play();
  }

  clearPhoto() {
    const context = this.canvas.nativeElement.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    const data = this.canvas.nativeElement.toDataURL('image/png');
    this.photo.nativeElement.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  private async initVideoStream() {
    const videoEl = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoStream = stream;
      try {
        videoEl.srcObject = stream;
      } catch (error) {
        videoEl.src = window.URL.createObjectURL(stream);
      }
      videoEl.play();

      videoEl.addEventListener('canplay', async () => {
        if (!this.isStreaming) {
          this.height = videoEl.videoHeight / (videoEl.videoWidth / this.width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(this.height)) {
            this.height = this.width / (4 / 3);
          }

          videoEl.setAttribute('width', this.width);
          videoEl.setAttribute('height', this.height);
          this.canvas.nativeElement.setAttribute('width', this.width);
          this.canvas.nativeElement.setAttribute('height', this.height);
          this.isStreaming = true;
          interval(1000).pipe(takeUntil(timer(4100))).subscribe(index => {
            if (this.isPhotoReady) {
              this.timerSecondsLeft = 0;
              return;
            }
            this.timerSecondsLeft = 3 - index;
            if (!this.timerSecondsLeft) {
              this.takePicture();
            }
          });

        }
      }, false);
    } else {
      this.isSupported = false;
      await sleep(1500);
      this.done.emit(null);
    }
  }

  private stopVideo() {
    try {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream.getTracks().forEach(track => this.videoStream.removeTrack(track));
      this.video.nativeElement.srcObject = null;
      this.video.nativeElement.src = null;
    } catch (error) {
      console.error('stopVideo() failed', error);
    }
  }

}
