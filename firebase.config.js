import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, query, orderBy, limit, collection, getDocs, getDoc, where, or, and, addDoc, } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,    
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,
    measurementId: Constants.manifest?.extra?.firebaseMeasurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const friendships = collection(db, "friendships");
const transactions = collection(db, "transactions");

export async function registration(email, password, firstName, lastName, username) {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("user created")
    const user = auth.currentUser;
    console.log("got user info")
    console.log(`info: uid: ${user.uid}, email: ${user.email}, lastName: ${lastName}, firstName: ${firstName}, username: ${username}`)

    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        lastName: lastName,
        firstName: firstName,
        username: username,
        pfp: "bobr"
    })
    console.log("done")
}

export async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function getTransactions(friendUID) {
    console.log('transaction function')
    const user = auth.currentUser;
    console.log("user created")
    const q = query(transactions, or(
        and(
            where('debt', '==', friendUID),
            where('paid', '==', user.uid),
        ),
        and(
            where('paid', '==', friendUID),
            where('debt', '==', user.uid),
        )
    ), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    console.log("snapshot")
    console.log(querySnapshot)

    let transactionArray = [];
    
    querySnapshot.forEach((document) => {
        console.log(document.id, ' => ' , document.data());
        const data = document.data();
        console.log("date")
        console.log(data.date)
        console.log(data.date.toDate())
        transactionArray.push({
            amount: data.amount,
            date: data.date.toDate(),
            debt: data.debt,
            note: data.note,
            paid: data.paid,
            id: document.id,
        });
    })

    console.log("trans inside func")
    console.log(transactionArray)
    
    return transactionArray
}

export async function getLastTrans(uid) {
    const user = auth.currentUser;
    const q = query(transactions, or(
        where('debt', '==', uid),
        where('paid', '==', uid)
    ),
    orderBy("date", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    let date = {
        amount: 0,
        date: new Date(),
        paid: '',
        debt: '',
        note: '',
        id: '0',
    };
    querySnapshot.forEach((document) => {
        console.log("last transaction: ")
        console.log(document.id, ' => ', document.data());
        const data = document.data();
        console.log("date")
        console.log(data.date)
        console.log(data.date.toDate())
        date = {
            amount: data.amount,
            date: data.date.toDate(),
            debt: data.debt,
            note: data.note,
            paid: data.paid,
            id: document.id,
        };
    })
    return date;
}

export async function sendTransaction(value) {
    const user = auth.currentUser;
    const paid = value.amount > 0;

    await addDoc(transactions, {
        paid: paid ? user.uid : value.friend.uid,
        debt: paid ? value.friend.uid : user.uid,
        amount: value.amount,
        date: new Date(),
        note: value.note,
    });
    console.log("transaction sent")
}

export async function getFriends() {
    console.log("getFriends called");
    const user = auth.currentUser;
    const q = query(friendships, or(
        where('friend1', '==', user.uid),
        where('friend2', '==', user.uid),
        ));
    const querySnapshot = await getDocs(q);
    console.log("snapshot: ")
    console.log(querySnapshot)

    let friends = [];
    console.log("for loop")
    querySnapshot.forEach((document) => {
        // console.log(document.id, " => ", document.data());
        const data = document.data();
        const first = (data.friend1 == user.uid) ? true : false;
        const friendUID = (first) ? data.friend2 : data.friend1;

        friends.push({
            uid: friendUID,
            balance: (first) ? data.balance : -data.balance,
        });
    });

    console.log("friends inside func")
    console.log(friends)
    
    return friends;
}

export async function getFriendData( entry ) {
    console.log("friend data uid: ", entry.uid)
    const data = await getDoc(doc(db, "users", entry.uid))
    const friend = data.data();
    // console.log("data")
    // console.log(data.data());
    return {
        username: friend.username,
        pfp: '../assets/bucket-gorilla.jpg',
        balance: entry.balance,
        lastTransaction: new Date(),
        uid: entry.uid,
    };
}

export { app };