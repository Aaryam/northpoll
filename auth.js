// Your web app's Firebase configuration

/* 
---------------------------------
Basic Configuration for Firebase 
---------------------------------
*/

(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDu6QPEsfUVyROGRqKivOpj7dAD2_ZCrKs",
        authDomain: "polltree-5277d.firebaseapp.com",
        databaseURL: "https://polltree-5277d.firebaseio.com",
        projectId: "polltree-5277d",
        storageBucket: "polltree-5277d.appspot.com",
        messagingSenderId: "74967904884",
        appId: "1:74967904884:web:7020f2d2e21cb5fdbe1721",
        measurementId: "G-51D1X90QQ1"
    };

    // initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    /* 
    --------------------------------------
    Login & Sign Up & Logout functionality
    --------------------------------------
    */

    // initialize variables for text fields, and buttons of login page
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const buttonLogin = document.getElementById("buttonLogin");
    const buttonSignUp = document.getElementById("buttonSignUp");
    const buttonLogout = document.getElementById("buttonLogout");
    const buttonPost = document.getElementById("buttonPost");

    const op1 = document.getElementById('op1');
    const op2 = document.getElementById('op2');
    const op3 = document.getElementById('op3');
    const op4 = document.getElementById('op4');

    const testCard = document.getElementById('testCard');
    var postage = {
        totalPostCount: 0,
    };


    // login event

    if (buttonLogin) {
        buttonLogin.addEventListener('click', e => {
            const email = txtEmail.value;
            const pass = txtPassword.value;
            const auth = firebase.auth();
            // Sign In
            const promise = auth.signInWithEmailAndPassword(email, pass);
            promise.catch(e => console.log(e.message))
        });
    }
    // sign up event
    if (buttonSignUp) {
        buttonSignUp.addEventListener('click', e => {

            // TODO: Check if email is legit :D
            // do so by doing some email authentication code & logic

            const email = txtEmail.value;
            const pass = txtPassword.value;
            const auth = firebase.auth();
            // Sign In
            const promise = auth.createUserWithEmailAndPassword(email, pass);
            promise.catch(e => console.log(e.message))
        });
    }

    buttonLogout.addEventListener('click', e => {
        firebase.auth().signOut();
    })

    // realtime listener -> checks for if the user has logged in or not.
    // moves to index.htm if has logged, and moves to login.htm if logged out.

    emailUser = null;
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
            let windowVar = window.location.pathname + window.location.search;
            if (windowVar.includes("login.htm")) {
                window.location.href = "index.htm";

                localStorage.setItem("emailCurrent", firebaseUser.email);
                localStorage.setItem("idCurrent", firebaseUser.uid);
            }
            else if (windowVar.includes("profile.htm"))
            {
                console.log("Profile Page");
            }
        }
        else {
            console.log("User not signed in");
            let windowVar = window.location.pathname + window.location.search;
            if (!windowVar.includes("login.htm")) {
                window.location.reload();
                window.location.href = "login.htm";
                localStorage.setItem("emailCurrent", null);
                localStorage.setItem("idCurrent", null);
            }

        }
    })

    /* 
    --------------------------------------
    Database functionality
    --------------------------------------
    */

    // add post function, gets the date (Year,Month,Day) and the time (Hour,Min)
    // then makes a new post based on that specific time stamp. post intervals 
    // are one minute

    let postVal;
    let userCount;

    function addPost(content) {

        // total post counting

        var counterRef = firebase.database().ref('users/');

        firebase.database().ref('users/' + 'totalCount/').on('value', function (snapshot) {
            postVal = snapshot.val();
        });

        if (postVal != null) {
            postVal = JSON.stringify(postVal);
            postVal = parseInt(postVal);
            counterRef.update({ 'totalCount': postVal + 1 })
            totalPostCount = postVal + 1;
        }
        else {
            counterRef.set({
                totalCount: 0,
            });
        }

        // user post counting

        var userCountRef = firebase.database().ref('users/' + (localStorage.getItem("idCurrent") + '/'));

        firebase.database().ref('users/' + (localStorage.getItem("idCurrent") + '/') + 'userCount').on('value', function (snapshot) {
            userCount = snapshot.val();
        });

        if (userCount != null) {
            userCount = JSON.stringify(userCount);
            userCount = parseInt(userCount);
            userCountRef.update({ 'userCount': userCount + 1 })
        }
        else {
            userCountRef.set({
                userCount: 0,
            });
            console.log("You have no posts :(");
        }

        let date = new Date();
        firebase.database().ref('users/' + (localStorage.getItem("idCurrent") + '/') + 'posts/' + 'userPosts/' + '/' + postVal).set({
            email: localStorage.getItem("emailCurrent"),
            content: content,
            date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
            op1: op1.value,
            op2: op2.value,
            op3: op3.value,
            op4: op4.value,
        });
        firebase.database().ref('totalPosts/' + postVal).set({
            email: localStorage.getItem("emailCurrent"),
            id: localStorage.getItem("idCurrent"),
            content: content,
            date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
            op1: op1.value,
            op2: op2.value,
            op3: op3.value,
            op4: op4.value,
        });
        firebase.database().ref('userIDs/' + localStorage.getItem('idCurrent') + '/' + postVal).set({
            email: localStorage.getItem("emailCurrent"),
            id: localStorage.getItem("idCurrent"),
            content: content,
            date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
            op1: op1.value,
            op2: op2.value,
            op3: op3.value,
            op4: op4.value,
        });
    }

    // simple on click event for the post button. posts the textbox value
    // and refreshes the textbox into "" after that.
if (buttonPost)
{
    buttonPost.addEventListener('click', e => {
        if (txtEmail.textLength <= 60 && op1.value.length <= 20 && op2.value.length <= 20 && op3.value.length <= 20 && op4.value.length <= 20) {
            textLengthGood();
        }
        else if (txtEmail.textLength > 60 || op1.value.length > 20 || op2.value.length > 20 || op3.value.length > 20 || op4.value.length > 20) {
            textLengthBad();
        }

        function textLengthGood() {
            txtEmail.placeholder = "Content";
            op1.placeholder = "Option 1";
            op2.placeholder = "Option 2";
            op3.placeholder = "Option 3";
            op4.placeholder = "Option 4";
            addPost(txtEmail.value);
            txtEmail.value = "";
            op1.value = "";
            op2.value = "";
            op3.value = "";
            op4.value = "";
        }

        function textLengthBad() {
            txtEmail.value = "";
            op1.value = "";
            op2.value = "";
            op3.value = "";
            op4.value = "";
            txtEmail.placeholder = "The character limit is: 60";
            op1.placeholder = "The character limit is: 20";
            op2.placeholder = "The character limit is: 20";
            op3.placeholder = "The character limit is: 20";
            op4.placeholder = "The character limit is: 20";
        }
    });
}
}());

// python -m SimpleHTTPServer | Command for setting up localhost
