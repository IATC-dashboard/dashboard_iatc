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

//open new modal
$("thead").on("click", ".btn-success", function (e) {
  e.preventDefault();
  $("#staff-modal .modal-body input").val("");
  $("#staff-modal").modal("show");
});

// add member data
$("#staff-modal .modal-footer").on("click", ".btn-success", function (e) {
  e.preventDefault();
  var address = $('#staff-modal .modal-body input[name="name"]').val().trim();
  var email = $('#staff-modal .modal-body input[name="email"]').val().trim();
  var phone = $('#staff-modal .modal-body input[name="phone"]').val().trim();
  var textarea = $("#staff-modal .modal-body #contactContent").val().trim();
  const userId = push(child(ref(db), "contact")).key;
  var branch = ref(db, "contact/" + userId);
  set(branch, {
    address,
    email,
    phone,
    textarea
  });
  $("#staff-modal .modal-body input").val("");
  $("#staff-modal .modal-body textarea").val("");
  $("#staff-modal").modal("hide");
});

//get page data
onValue(ref(db, "contact"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    $("tbody").append(`
        <tr data-id="${childKey}">
        <td></td>
        <td>${childData.address}</td>
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
  var deleteContactKey = $(this).parents("tr").data("id");
  const rootRef = ref(db, "contact/" + deleteContactKey);
  remove(rootRef);
  Nomrele();
});

//open edit modal and get modal data
$("tbody").on("click", ".btn-primary", function (e) {
  e.preventDefault();
  var editContactKey = $(this).parents("tr").data("id");
  $("#staffUpdate-modal").modal("show");
  onValue(ref(db, "contact/" + editContactKey), (snapshot) => {
    $('#staffUpdate-modal .modal-body input[name="name"]').val(
      snapshot.val().address
    );
    $('#staffUpdate-modal .modal-body input[name="email"]').val(
      snapshot.val().email
    );
    $("#staffUpdate-modal .modal-body #contactContent").val(
      snapshot.val().textarea
    );
    $('#staffUpdate-modal .modal-body input[name="phone"]').val(
      snapshot.val().phone
    );
  });

  // //edit page data
  $("#staffUpdate-modal .modal-footer").on(
    "click",
    "#edit-contact",
    function (e) {
      e.preventDefault();
      var address = $('#staffUpdate-modal .modal-body input[name="name"]').val().trim();
      var email = $('#staffUpdate-modal .modal-body input[name="email"]').val().trim();
      var phone = $('#staffUpdate-modal .modal-body input[name="phone"]').val().trim();
      var textarea = $("#staffUpdate-modal .modal-body #contactContent").val().trim();

      const rootRef = ref(db, "contact/" + editContactKey);
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
