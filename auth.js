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


    // authentication,  email link

    var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: 'aaryam.github.io/northpoll',
        // This must be true.
        handleCodeInApp: true,
        iOS: {
            bundleId: 'com.example.ios'
        },
        android: {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
        },
        dynamicLinkDomain: 'example.page.link'
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

    if (buttonLogout != null) {
        buttonLogout.addEventListener('click', e => {
            firebase.auth().signOut();
        })
    }

    // realtime listener -> checks for if the user has logged in or not.
    // moves to index.htm if has logged, and moves to login.htm if logged out.

    emailUser = null;
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            let windowVar = window.location.pathname + window.location.search;
            if (windowVar.includes("login.htm") || windowVar.includes("register.htm")) {
                window.location.href = "index.htm";

                localStorage.setItem("emailCurrent", firebaseUser.email);
                localStorage.setItem("idCurrent", firebaseUser.uid);
            }
            else if (windowVar.includes("profile.htm")) {
                console.log("Profile Page");
            }
        }
        else {
            console.log("User not signed in");
            let windowVar = window.location.pathname + window.location.search;
            if (!windowVar.includes("login.htm") && !windowVar.includes("register.htm")) {
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

        // options

        firebase.database().ref('users/' + localStorage.getItem("idCurrent") + '/' + 'posts/' + 'userPosts/' + postVal + '/' + 'op1/').set({
            text: op1.value,
            count: 0,
        });

        firebase.database().ref('totalPosts/' + postVal + '/' + 'op1/').set({
            text: op1.value,
            count: 0,
        });
        firebase.database().ref('userIDs/' + localStorage.getItem('idCurrent') + '/' + postVal + '/' + 'op1/').set({
            text: op1.value,
            count: 0,
        });

        firebase.database().ref('users/' + localStorage.getItem("idCurrent") + '/' + 'posts/' + 'userPosts/' + postVal + '/' + 'op2/').set({
            text: op2.value,
            count: 0,
        });

        firebase.database().ref('totalPosts/' + postVal + '/' + 'op2/').set({
            text: op2.value,
            count: 0,
        });
        firebase.database().ref('userIDs/' + localStorage.getItem('idCurrent') + '/' + postVal + '/' + 'op2/').set({
            text: op2.value,
            count: 0,
        });

        firebase.database().ref('users/' + localStorage.getItem("idCurrent") + '/' + 'posts/' + 'userPosts/' + postVal + '/' + 'op3/').set({
            text: op3.value,
            count: 0,
        });

        firebase.database().ref('totalPosts/' + postVal + '/' + 'op3/').set({
            text: op3.value,
            count: 0,
        });
        firebase.database().ref('userIDs/' + localStorage.getItem('idCurrent') + '/' + postVal + '/' + 'op3/').set({
            text: op3.value,
            count: 0,
        });

        firebase.database().ref('users/' + localStorage.getItem("idCurrent") + '/' + 'posts/' + 'userPosts/' + postVal + '/' + 'op4/').set({
            text: op4.value,
            count: 0,
        });

        firebase.database().ref('totalPosts/' + postVal + '/' + 'op4/').set({
            text: op4.value,
            count: 0,
        });
        firebase.database().ref('userIDs/' + localStorage.getItem('idCurrent') + '/' + postVal + '/' + 'op4/').set({
            text: op4.value,
            count: 0,
        });
    }

    // simple on click event for the post button. posts the textbox value
    // and refreshes the textbox into "" after that.
    if (buttonPost) {
        buttonPost.addEventListener('click', e => {
            console.log("post");
            textLengthGood();

            function textLengthGood() {
                addPost(txtEmail.value);
                txtEmail.value = "";
                op1.value = "";
                op2.value = "";
                op3.value = "";
                op4.value = "";
            }
        });
    }

}());

// python -m SimpleHTTPServer | Command for setting up localhost
