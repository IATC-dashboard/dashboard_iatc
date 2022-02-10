import { auth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "./module.js";

$("#signUp").on("click", function (e) {
  e.preventDefault();
  const email = $("#email").val();
  const password = $("#password").val();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          window.location.href = "index.html";
        }
      );
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage);
      alert(errorMessage);
    });
});
