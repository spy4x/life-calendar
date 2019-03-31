import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class FirebaseService {
  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {}

  async save(userData, file) {
    try {
      const id = this.db.createId();
      const photoPath = `photos/${id}`;
      const data = {
        ...userData,
        photoPath
      };
      await this.db.doc(`users/${id}`).set(data);
      const fileBlob = this.b64toBlob(file);
      await this.storage.upload(photoPath, fileBlob);
    } catch (error) {
      console.log(error);
    }
  }

  b64toBlob(b64Data) {
    const byteString = atob(b64Data.split(',')[1]);
    const mimeString = b64Data.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
  }
}
