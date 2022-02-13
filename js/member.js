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
  getDownloadURL
} from "./module.js";

//logout
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
  var surname = $('#staff-modal .modal-body input[name="surname"]').val().trim();
  var position = $('#staff-modal .modal-body input[name="position"]').val().trim();
  var facebookLink = $('#staff-modal .modal-body input[name="facebook"]').val().trim();
  var twitterLink = $('#staff-modal .modal-body input[name="twitter"]').val().trim();
  var linkedinLink = $('#staff-modal .modal-body input[name="linkedin"]').val().trim();

  var reader = new FileReader();
  var myFile = $("#upload").prop("files");
  var temp = myFile[0].name.split(".");
  var fname = temp[0];
  var ext = temp[1];
  reader.readAsDataURL(myFile[0]);

  var ImgToUpload = myFile[0];
  var imgName = myFile[0].name;

  const metaData = {
    contentType: ImgToUpload.type,
  };

  const userId = push(child(ref(db), "members")).key;
  var branch = ref(db, "members/" + userId);
  const imagesRef = sRef(storage, "members/" + imgName);

  const UploadTask = uploadBytesResumable(imagesRef, ImgToUpload, metaData);

  UploadTask.on(
    "state-changed",
    (snapshot) => {},
    (error) => {
      alert("error: image not uploaded!" + error);
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log(downloadURL);
          SaveURLtoRealtimDB(downloadURL);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
  function SaveURLtoRealtimDB(URL) {
    set(branch, {
      name,
    surname,
    position,
    facebookLink,
    twitterLink,
    linkedinLink,
      ImageName: fname +"."+ ext,
      ImgUrl: URL,
    });
  }

 
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
      <tr data-id="${childKey}" data-name="${childData.ImageName}">
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
    var reader = new FileReader();
      var myFile = $("#updateUpload").prop("files");
      var temp = myFile[0].name.split(".");
      var fname = temp[0];
      var ext = temp[1];
      reader.readAsDataURL(myFile[0]);

      var ImgToUpload = myFile[0];
      var imgName = myFile[0].name;

      const metaData = {
        contentType: ImgToUpload.type,
      };
      const rootRef = ref(db, "members/" + editMemberKey);
      const imagesRef = sRef(storage, "members/" + imgName);

      const UploadTask = uploadBytesResumable(imagesRef, ImgToUpload, metaData);

      UploadTask.on(
        "state-changed",
        (snapshot) => {},
        (error) => {
          alert("error: image not uploaded!" + error);
        },
        () => {
          getDownloadURL(UploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log(downloadURL);
              SaveURLtoRealtimDB(downloadURL);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
      function SaveURLtoRealtimDB(URL) {
        update(rootRef, {
          name,
      surname,
      position,
      facebookLink,
      twitterLink,
      linkedinLink,
          ImageName: fname + ext,
          ImgUrl: URL
        });
      }

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
