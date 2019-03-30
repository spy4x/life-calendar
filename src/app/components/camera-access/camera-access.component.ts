import {
  AfterViewInit,
  Component, ElementRef, Output, ViewChild,
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
  public captures: Array<any>;
  constructor() {
    this.captures = [];
  }

  public ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        console.log(stream.getVideoTracks()[0]);
        try {
          this.video.nativeElement.srcObject = stream;
        } catch (error) {
          this.video.nativeElement.src = window.URL.createObjectURL(stream);
        }
        this.video.nativeElement.play();
      });
    }
  }

  public capture() {
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
  }
}
