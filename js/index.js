import { auth, signOut } from "./module.js";

    $("#logout").on("click", function (e) {
        e.preventDefault();

        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "login.html";
          }).catch((error) => {
            // An error happened.
            console.log(error);
          });
      });
