import { db } from "./firebase.js";


import {
    doc,
    getDoc,
    collection,
    query,
    where,
    orderBy,
    getDocs
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const clientId = localStorage.getItem("clientId");


if(!clientId){

    document.body.innerHTML =
    "<h2>Клиент табылмады</h2>";

}



async function loadProfile(){


    const clientRef = doc(db,"clients",clientId);

    const clientSnap = await getDoc(clientRef);



    if(!clientSnap.exists()){

        return;

    }


    const client = clientSnap.data();



    document.getElementById("name").innerHTML =
    "👤 " + client.fullName;


    document.getElementById("points").innerHTML =
   
    client.points;
    const level = getCustomerLevel(client.points);


    document.getElementById("level").innerHTML =
    level.name;


    document.getElementById("discount").innerHTML =
    level.discount;


    if(level.next){

    document.getElementById("nextLevel").innerHTML =
    `
    Келесі деңгейге:
    ${level.next - client.points} ұпай қалды
    `;

    }
    else{

    document.getElementById("nextLevel").innerHTML =
    `
    🎉 Сіз ең жоғары деңгейдесіз!
    `;

    }


    

    document.getElementById("visits").innerHTML =
    client.visits;



    const historyBox =
    document.getElementById("history");



    const q = query(

        collection(db,"history"),

        where("clientId","==",clientId)

    );



    const snap = await getDocs(q);



    snap.forEach(item=>{


        const data=item.data();


        historyBox.innerHTML +=
        `
        <p>
        🎁 +${data.reward} ұпай
        <br>
        <small>
        ${data.createdAt.toDate().toLocaleDateString()}
        </small>
        </p>
        `;


    });


}



function getCustomerLevel(points){


    if(points < 100){

        return {

            name:"🌱 Жаңа клиент",

            discount:2,

            next:100

        };

    }


    if(points < 300){

        return {

            name:"😊 Біздің клиент",

            discount:3,

            next:300

        };

    }


    if(points < 500){

        return {

            name:"⭐ Тұрақты клиент",

            discount:5,

            next:500

        };

    }


    if(points < 1000){

        return {

            name:"💎 Белсенді клиент",

            discount:6,

            next:1000

        };

    }


    return {

        name:"👑 VIP клиент",

        discount:10,

        next:null

    };

}


loadProfile();