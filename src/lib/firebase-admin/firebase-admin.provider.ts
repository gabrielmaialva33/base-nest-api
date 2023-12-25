import type admin from 'firebase-admin';
import { FIREBASE_ADMIN_TOKEN } from '@src/lib/firebase-admin/firebase-admin.constant';
import { NestFirebaseService } from '@src/lib/firebase-admin/firebase.service';

export const connectionFactory = {
  provide: FIREBASE_ADMIN_TOKEN,
  useFactory: async (nestFirebaseService: {
    getFirebaseAdmin: () => admin.app.App;
  }) => {
    return nestFirebaseService.getFirebaseAdmin();
  },
  inject: [NestFirebaseService],
};
