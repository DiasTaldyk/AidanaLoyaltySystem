import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const btn50 = document.getElementById("btn50");
const btn100 = document.getElementById("btn100");
const btn200 = document.getElementById("btn200");

const qrDiv = document.getElementById("qrcode");

async function createToken(reward){

    qrDiv.innerHTML = "QR дайындалуда...";

    // 60 секундтан кейін жарамсыз болады
    const expires = new Date(Date.now() + 60000);

    const docRef = await addDoc(collection(db,"tokens"),{

        reward: reward,

        used: false,

        createdAt: Timestamp.now(),

        expiresAt: Timestamp.fromDate(expires)

    });

    const tokenId = docRef.id;

    const url = new URL("claim.html", window.location.href);

    url.searchParams.set("t",tokenId);

    qrDiv.innerHTML="";

    QRCode.toCanvas(url.toString(),{
        width:260
    },function(err,canvas){

        if(err){
            console.error(err);
            return;
        }

        qrDiv.appendChild(canvas);

    });

    setTimeout(()=>{

        qrDiv.innerHTML="<h3>QR мерзімі аяқталды</h3>";

    },60000);

}

btn50.onclick=()=>createToken(50);

btn100.onclick=()=>createToken(100);

btn200.onclick=()=>createToken(200);







const profileQrBtn =
document.getElementById("profileQrBtn");


const profileQr =
document.getElementById("profileQr");



profileQrBtn.onclick = ()=>{


    profileQr.innerHTML="";


    let url =
    window.location.origin +
    window.location.pathname
    .replace("seller.html","profile.html");


    QRCode.toCanvas(
        url,
        function(error, canvas){
    
            if(error){
    
                console.error(error);
                return;
    
            }
    
            profileQr.innerHTML="";
    
            profileQr.appendChild(canvas);
    
        }
    );


};