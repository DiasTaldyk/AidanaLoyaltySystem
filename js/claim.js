import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    addDoc,
    collection,
    updateDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const status = document.getElementById("status");
const register = document.getElementById("register");
const registerBtn = document.getElementById("registerBtn");

const params = new URLSearchParams(window.location.search);
const tokenId = params.get("t");

let currentToken = null;
let savedClientId = localStorage.getItem("clientId");


async function checkToken() {

    if (!tokenId) {
        status.innerHTML = "<h2>❌ Token жоқ</h2>";
        return;
    }


    const tokenRef = doc(db, "tokens", tokenId);
    const tokenSnap = await getDoc(tokenRef);


    if (!tokenSnap.exists()) {

        status.innerHTML = "<h2>❌ QR жарамсыз</h2>";
        return;
    }


    currentToken = tokenSnap.data();


    if (currentToken.used) {

        status.innerHTML =
        "<h2>⚠️ Бұл QR қолданылған</h2>";

        return;
    }


    if(new Date() > currentToken.expiresAt.toDate()){

        status.innerHTML =
        "<h2>⌛ QR мерзімі аяқталған</h2>";

        return;
    }


    status.innerHTML =
    `<h2>🎉 Сізге ${currentToken.reward} ұпай беріледі!</h2>`;
    if(savedClientId){

        await addPoints(savedClientId);

    }else{

        register.style.display="block";

    }


    register.style.display="block";

}



registerBtn.onclick = async ()=>{


    const fullName =
    document.getElementById("fullName").value.trim();


    const phone =
    document.getElementById("phone").value.trim();



    if(!fullName || !phone){

        alert("Барлық жолды толтырыңыз");
        return;
    }



    try{


        // Клиент жасау

        const clientRef = await addDoc(
            collection(db,"clients"),
            {

                fullName: fullName,

                phone: phone,

                points: currentToken.reward,

                visits: 1,

                createdAt: Timestamp.now()

            }
        );


        const clientId = clientRef.id;



        // тарихқа жазу

        await addDoc(
            collection(db,"history"),
            {

                clientId: clientId,

                tokenId: tokenId,

                reward: currentToken.reward,

                createdAt: Timestamp.now()

            }
        );



        // QR қолданылды

        await updateDoc(
            doc(db,"tokens",tokenId),
            {

                used:true,

                usedBy:clientId

            }
        );



        // телефонда сақтау

        localStorage.setItem(
            "clientId",
            clientId
        );



        status.innerHTML =
        `
        <h2>🎉 ${currentToken.reward} ұпай қосылды!</h2>
        <h3>Профиль ашылуда...</h3>
        `;

        setTimeout(()=>{

            window.location.href = "profile.html";

        },1500);



        register.style.display="none";


    }
    catch(error){

        console.error(error);

        alert("Қате шықты");

    }


};



async function addPoints(clientId){


    const clientRef = doc(db,"clients",clientId);

    const clientSnap = await getDoc(clientRef);


    if(!clientSnap.exists()){

        localStorage.removeItem("clientId");

        register.style.display="block";

        return;

    }


    const client = clientSnap.data();



    await updateDoc(clientRef,{

        points:
        client.points + currentToken.reward,

        visits:
        client.visits + 1,

        lastVisit:
        Timestamp.now()

    });



    await addDoc(
        collection(db,"history"),
        {

            clientId:clientId,

            tokenId:tokenId,

            reward:currentToken.reward,

            createdAt:Timestamp.now()

        }
    );



    await updateDoc(
        doc(db,"tokens",tokenId),
        {

            used:true,

            usedBy:clientId

        }
    );



    status.innerHTML =
    `
    <h2>🎉 Құттықтаймыз!</h2>
    <h3>${currentToken.reward} ұпай қосылды</h3>
    <h3>Профиль ашылуда...</h3>
    `;

    setTimeout(()=>{

        window.location.href = "profile.html";

    },1500);


}



checkToken();