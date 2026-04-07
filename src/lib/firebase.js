import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiGQKhFbak81_zVBBeHOLGjSpuJ68EKmg",
  authDomain: "resa-gite.firebaseapp.com",
  projectId: "resa-gite",
  storageBucket: "resa-gite.firebasestorage.app",
  messagingSenderId: "773467849323",
  appId: "1:773467849323:web:15eadc8bd0ea294061a72e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
