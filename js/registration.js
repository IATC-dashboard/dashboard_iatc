import {
  db,
  set,
  ref,
  onValue,
  push,
  child,
  update,
  remove,
} from "./module.js";

//logout
import { auth, signOut } from "./module.js";

$("#logout").on("click", function (e) {
  e.preventDefault();

  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "login.html";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
});

//open new modal
$("thead").on("click", ".btn-success", function (e) {
  e.preventDefault();
  $("#staff-modal .modal-body input").val("");
  $("#staff-modal").modal("show");
});

//get page data
onValue(ref(db, "registration"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    $("tbody").append(`
          <tr data-id="${childKey}">
          <td></td>
          <td>${childData.name}</td>
          <td>${childData.email}</td>
          <td>${childData.phone}</td>
          <td>
          <button class="btn btn-primary"><i class="fa fa-pencil"></i>
          </button>
          <button class="btn btn-danger delete"><i class="fa fa-trash"></i>
          </button>
          </td>
          </tr>
      `);
  });
  Nomrele();
});

//delete page data
$("tbody").on("click", ".delete", function (e) {
  e.preventDefault();
  var deleteRegistrationtKey = $(this).parents("tr").data("id");
  const rootRef = ref(db, "registration/" + deleteRegistrationtKey);
  remove(rootRef);
  Nomrele();
});

//open edit modal and get modal data
$("tbody").on("click", ".btn-primary", function (e) {
  e.preventDefault();
  var editRegistrationKey = $(this).parents("tr").data("id");
  console.log(editRegistrationKey);
  $("#staffUpdate-modal").modal("show");
  onValue(ref(db, "registration/" + editRegistrationKey), (snapshot) => {
    $('#staffUpdate-modal .modal-body input[name="name"]').val(
      snapshot.val().name
    );
    $('#staffUpdate-modal .modal-body input[name="courseName"]').val(
      snapshot.val().program
    );
    $('#staffUpdate-modal .modal-body input[name="email"]').val(
      snapshot.val().email
    );
    $("#staffUpdate-modal .modal-body #registrationContent").val(
      snapshot.val().textarea
    );
    $('#staffUpdate-modal .modal-body input[name="phone"]').val(
      snapshot.val().phone
    );
    $('#staffUpdate-modal .modal-body #registrationContent').val(snapshot.val().content);
  });

  //edit page data
  $("#staffUpdate-modal .modal-footer").on(
    "click",
    "#edit-registration",
    function (e) {
      e.preventDefault();
      var address = $('#staffUpdate-modal .modal-body input[name="name"]').val().trim();
      var email = $('#staffUpdate-modal .modal-body input[name="email"]').val().trim();
      var phone = $('#staffUpdate-modal .modal-body input[name="phone"]').val().trim();
      var textarea = $("#staffUpdate-modal .modal-body #registrationContent").val().trim();

      const rootRef = ref(db, "registration/" + editContactKey);
      update(rootRef, {
        address,
        email,
        phone,
         textarea,
      });
      $("#staffUpdate-modal").modal("hide");
    }
  );
});

//number table rows
function Nomrele() {
  var k = 0;
  $("tbody tr").each(function () {
    $(this)
      .find("td:eq(0)")
      .text(++k);
  });
}
