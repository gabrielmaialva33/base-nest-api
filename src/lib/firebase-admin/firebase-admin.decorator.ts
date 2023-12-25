import { FIREBASE_ADMIN_TOKEN } from '@src/lib/firebase-admin/firebase-admin.constant';
import { Inject } from '@nestjs/common';

export const InjectFirebaseAdmin = () => Inject(FIREBASE_ADMIN_TOKEN);
