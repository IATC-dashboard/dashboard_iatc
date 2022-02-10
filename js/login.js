import {  auth,  signInWithEmailAndPassword} from "./module.js";

$("#login").on("click", function (e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    window.location.href="index.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("User not found!!!")
  });
});
