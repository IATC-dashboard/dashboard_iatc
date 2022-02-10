import {
  db,
  set,
  ref,
  onValue,
  push,
  child,
  update,
  remove,
  storage,
  sRef,
  uploadBytesResumable,
  getDownloadURL,
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
  var textarea = $("#staff-modal .modal-body #aboutContent").val().trim();
  var photo = $('#staff-modal .modal-body input[name="file"]').val().trim();
  const userId = push(child(ref(db), "about")).key;
  var branch = ref(db, "about/" + userId);
  set(branch, {
    name,
    textarea,
  });
      const metaData ={
        contentType: 'image/jpeg'
      }
      const imageId = push(child(sRef(storage), "images")).key;
      console.log(imageId);
      const imagesRef = sRef(storage, "images"+ imageId );
      console.log(imagesRef)

      const uploadTask = uploadBytesResumable(imagesRef, photo,metaData);
      console.log(uploadTask);
  $("#staff-modal .modal-body input").val("");
  $("#staff-modal .modal-body textarea").val("");
  $("#staff-modal").modal("hide");
});

//get page data
onValue(ref(db, "about"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    $("tbody").append(`
        <tr data-id="${childKey}">
        <td></td>
        <td>${childData.name}</td>
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
  var deleteAboutKey = $(this).parents("tr").data("id");
  const rootRef = ref(db, "about/" + deleteAboutKey);
  remove(rootRef);
  Nomrele();
});

//open edit modal and get modal data
$("tbody").on("click", ".btn-primary", function (e) {
  e.preventDefault();
  var editAboutKey = $(this).parents("tr").data("id");
  $("#staffUpdate-modal").modal("show");
  onValue(ref(db, "about/" + editAboutKey), (snapshot) => {
    console.log(snapshot.val().photo);
    $('#staffUpdate-modal .modal-body input[name="name"]').val(
      snapshot.val().name
    );
    $("#staffUpdate-modal .modal-body #aboutContent").val(
      snapshot.val().textarea
    );
    $('#staffUpdate-modal .modal-body input[name="file"]').val(
      snapshot.val().photo
    );
  });

  // //edit page data
  $("#staffUpdate-modal .modal-footer").on(
    "click",
    "#edit-about",
    function (e) {
      e.preventDefault();
      var name = $('#staffUpdate-modal .modal-body input[name="name"]')
        .val()
        .trim();
      var textarea = $("#staffUpdate-modal .modal-body #aboutContent")
        .val()
        .trim();
      var photo = $('#staffUpdate-modal .modal-body input[name="file"]')
        .val()
        .trim();

      
      const rootRef = ref(db, "about/" + editAboutKey);
      update(rootRef, {
        name,
        textarea,
        photo
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
