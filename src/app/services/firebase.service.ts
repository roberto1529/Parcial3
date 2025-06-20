import { firebaseApp } from '../firebase.config';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc
} from 'firebase/firestore';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const register = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  // Guardar el perfil del usuario en Firestore
  const userRef = doc(db, `users/${user.uid}`);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    createdAt: new Date().toISOString(),
    role: 'usuario' // puedes usar esto para validar permisos después
  });

  return user;
};
export const logout = () => signOut(auth);

export const onUserChange = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, callback);
};

// Crear taller
export const crearTaller = async (userId: string, taller: any) => {
  // 1. Guardar en colección global
  const refGlobal = doc(collection(db, 'talleres'));
  await setDoc(refGlobal, {
    ...taller,
    userId,
    id: refGlobal.id
  });

  // 2. Guardar en subcolección del usuario organizador
  const refUsuario = doc(db, `talleres/${refGlobal.id}`);
  await setDoc(refUsuario, {
    ...taller,
    id: refGlobal.id
  });

  return refGlobal.id;
};

// Obtener todos los talleres
export const getTodosLosTalleres = async () => {
  const ref = collection(db, 'talleres');
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const inscribirseATaller = async (tallerId: string, user: any) => {
  const ref = doc(db, `talleres/${tallerId}/inscritos/${user.uid}`);
  await setDoc(ref, {
    nombre: user.email,
    pagado: true,
    inscritoEn: new Date().toISOString()
  });
};

// Obtener talleres del usuario
export const getTalleres = async (userId: string) => {
  const ref = collection(db, 'talleres');
  const q = query(ref, where('userId', '==', userId)); // Filtra por el userId
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar invitado
export const agregarInvitado = async (userId: string, tallerId: string, invitado: any) => {
  const ref = collection(db, `users/${userId}/talleresOrganizados/${tallerId}/invitados`);
  return await addDoc(ref, invitado);
};

// Marcar invitado como pagado
export const marcarPago = async (userId: string, tallerId: string, invitadoId: string) => {
  const ref = doc(db, `users/${userId}/talleresOrganizados/${tallerId}/invitados/${invitadoId}`);
  return await updateDoc(ref, { pagado: true });
};

// Obtener invitados que pagaron
export const getPagados = async (userId: string, tallerId: string) => {
  const invitadosRef = collection(db, `users/${userId}/talleresOrganizados/${tallerId}/invitados`);
  const q = query(invitadosRef, where('pagado', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener todos los invitados de un taller
export const getInvitados = async (userId: string, tallerId: string) => {
  const ref = collection(db, `users/${userId}/talleresOrganizados/${tallerId}/invitados`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener detalle de un taller
export const getTallerById = async (userId: string, tallerId: string) => {
  const ref = doc(db, `users/${userId}/talleresOrganizados/${tallerId}`);
  const snapshot = await getDoc(ref);
  return { id: snapshot.id, ...snapshot.data() };
};

// Crear un taller
export const addTaller = async (taller: any) => {
  const ref = collection(db, 'talleres');
  return await addDoc(ref, taller);
};
