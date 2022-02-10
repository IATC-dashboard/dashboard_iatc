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
  var name = $('#staff-modal .modal-body input[name="name"]').val().trim();
  var surname = $('#staff-modal .modal-body input[name="surname"]')
    .val()
    .trim();
  var position = $('#staff-modal .modal-body input[name="position"]')
    .val()
    .trim();
  var facebookLink = $('#staff-modal .modal-body input[name="facebook"]')
    .val()
    .trim();
  var twitterLink = $('#staff-modal .modal-body input[name="twitter"]')
    .val()
    .trim();
  var linkedinLink = $('#staff-modal .modal-body input[name="linkedin"]')
    .val()
    .trim();
  const userId = push(child(ref(db), "members")).key;
  var branch = ref(db, "members/" + userId);
  set(branch, {
    name,
    surname,
    position,
    facebookLink,
    twitterLink,
    linkedinLink,
  });
  $("#staff-modal .modal-body input").val("");
  $("#staff-modal").modal("hide");
});

//get page data
onValue(ref(db, "members"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    $("tbody").append(`
      <tr data-id="${childKey}">
      <td></td>
      <td>${childData.name}</td>
      <td>${childData.surname}</td>
      <td>${childData.position}</td>
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
  var deleteMemberKey = $(this).parents("tr").data("id");
  const rootRef = ref(db, "members/" + deleteMemberKey);
  remove(rootRef);
  Nomrele();
});

//open edit modal and get modal data
$("tbody").on("click", ".btn-primary", function (e){
    e.preventDefault();
    var editMemberKey = $(this).parents("tr").data("id");
    $("#staffUpdate-modal").modal("show");
    onValue(ref(db, "members/"+ editMemberKey), (snapshot) => {
              $('#staffUpdate-modal .modal-body input[name="name"]').val(snapshot.val().name);
              $('#staffUpdate-modal .modal-body input[name="surname"]').val(snapshot.val().surname);
              $('#staffUpdate-modal .modal-body input[name="position"]').val(snapshot.val().position);
              $('#staffUpdate-modal .modal-body input[name="facebook"]').val(snapshot.val().facebookLink);
              $('#staffUpdate-modal .modal-body input[name="twitter"]').val(snapshot.val().twitterLink);
              $('#staffUpdate-modal .modal-body input[name="linkedin"]').val(snapshot.val().linkedinLink);
          });
 
  // //edit page data
  $("#staffUpdate-modal .modal-footer").on("click", "#edit-member", function (e) {
      e.preventDefault();
    var name = $('#staffUpdate-modal .modal-body input[name="name"]').val().trim();
    var surname = $('#staffUpdate-modal .modal-body input[name="surname"]').val().trim();
    var position = $('#staffUpdate-modal .modal-body input[name="position"]').val().trim();
    var facebookLink = $('#staffUpdate-modal .modal-body input[name="facebook"]').val().trim();
    var twitterLink = $('#staffUpdate-modal .modal-body input[name="twitter"]').val().trim();
    var linkedinLink = $('#staffUpdate-modal .modal-body input[name="linkedin"]').val().trim();

    const rootRef = ref(db, "members/" + editMemberKey);
    update(rootRef,{
        name,
      surname,
      position,
      facebookLink,
      twitterLink,
      linkedinLink
    });
    $("#staffUpdate-modal").modal("hide");
  });
});
//number table rows
function Nomrele() {
  var k = 0;
  $("tbody tr").each(function () {
    $(this)
      .find("td:eq(0)")
      .text(++k);
    console.log();
  });
}
