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
    var title = $('#staff-modal .modal-body input[name="title"]').val().trim();
    var textarea = $('#staff-modal .modal-body #eventContent').val().trim();

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
  
    const userId = push(child(ref(db), "events")).key;
    var branch = ref(db, "events/" + userId);
    const imagesRef = sRef(storage, "events/" + imgName);
  
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
        title,
      textarea,
        ImageName: fname +"."+ ext,
        ImgUrl: URL,
      });
    }

    
    $("#staff-modal .modal-body input").val("");
    $("#staff-modal .modal-body textarea").val("");
    $("#staff-modal").modal("hide");
  });
  
  //get page data
  onValue(ref(db, "events"), (snapshot) => {
    $("tbody").empty();
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      $("tbody").append(`
        <tr data-id="${childKey}" data-name="${childData.ImageName}">
        <td></td>
        <td>${childData.title}</td>
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
    var deleteEventKey = $(this).parents("tr").data("id");
    const rootRef = ref(db, "events/" + deleteEventKey);
    remove(rootRef);
    Nomrele();
  });
  
  //open edit modal and get modal data
  $("tbody").on("click", ".btn-primary", function (e){
      e.preventDefault();
      var editEventKey = $(this).parents("tr").data("id");
      $("#staffUpdate-modal").modal("show");
      onValue(ref(db, "events/"+ editEventKey), (snapshot) => {
                $('#staffUpdate-modal .modal-body input[name="title"]').val(snapshot.val().title);
                $('#staffUpdate-modal .modal-body #eventContent').val(snapshot.val().textarea);
                $('#staffUpdate-modal .modal-body input[name="file"]').val(snapshot.val().ImageName);
            });
   
    // //edit page data
    $("#staffUpdate-modal .modal-footer").on("click", "#edit-event", function (e) {
        e.preventDefault();
        var title = $('#staffUpdate-modal .modal-body input[name="title"]').val().trim();
        var textarea = $('#staffUpdate-modal .modal-body #eventContent').val().trim();

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
        const rootRef = ref(db, "events/" + editEventKey);
        const imagesRef = sRef(storage, "events/" + imgName);
  
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
            title,
            textarea,
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
  