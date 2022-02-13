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

// add member data
$("#staff-modal .modal-footer").on("click", ".btn-success", function (e) {
  e.preventDefault();
  var name = $('#staff-modal .modal-body input[name="name"]').val().trim();
  var teacher = $('#staff-modal .modal-body input[name="teacher"]')
    .val()
    .trim();
  var courseContent = $("#staff-modal .modal-body #courseContent").val().trim();
  var information = $("#staff-modal .modal-body #information").val().trim();
  var duration = $('#staff-modal .modal-body input[name="duration"]')
    .val()
    .trim();
  var student = $('#staff-modal .modal-body input[name="student"]')
    .val()
    .trim();
  var participants = $("#staff-modal .modal-body #participants").val().trim();
  var program = $("#staff-modal .modal-body #program").val().trim();
  var skills = $("#staff-modal .modal-body #skills").val().trim();
  const userId = push(child(ref(db), "course")).key;
  var branch = ref(db, "course/" + userId);

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
  const imagesRef = sRef(storage, "course/" + imgName);

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
          // console.log(downloadURL);
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
      teacher,
      courseContent,
      information,
      duration,
      student,
      participants,
      program,
      skills,
      ImageName: fname + "." + ext,
      ImgUrl: URL,
    });
  }
  // set(branch, {
  //   name,
  //   teacher,
  //   courseContent,
  //   information,
  //   duration,
  //   student,
  //   participants,
  //   program,
  //   skills
  // });
  $("#staff-modal .modal-body input").val("");
  $("#staff-modal .modal-body textarea").val("");
  $("#staff-modal").modal("hide");
});

//get page data
onValue(ref(db, "course"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    $("tbody").append(`
          <tr data-id="${childKey}" data-name="${childData.ImageName}">
          <td></td>
          <td>${childData.name}</td>
          <td>${childData.teacher}</td>
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
  var deleteCourseKey = $(this).parents("tr").data("id");
  const rootRef = ref(db, "course/" + deleteCourseKey);
  remove(rootRef);
  Nomrele();
});

//open edit modal and get modal data
$("tbody").on("click", ".btn-primary", function (e) {
  e.preventDefault();
  var editCourseKey = $(this).parents("tr").data("id");
  $("#staffUpdate-modal").modal("show");
  onValue(ref(db, "course/" + editCourseKey), (snapshot) => {
    $('#staffUpdate-modal .modal-body input[name="name"]').val(
      snapshot.val().name
    );
    $('#staffUpdate-modal .modal-body input[name="teacher"]').val(
      snapshot.val().teacher
    );
    $("#staffUpdate-modal .modal-body #courseContent").val(
      snapshot.val().courseContent
    );
    $("#staffUpdate-modal .modal-body #information").val(
      snapshot.val().information
    );
    $('#staffUpdate-modal .modal-body input[name="duration"]').val(
      snapshot.val().duration
    );
    $('#staffUpdate-modal .modal-body input[name="student"]').val(
      snapshot.val().student
    );
    $("#staffUpdate-modal .modal-body #participants").val(
      snapshot.val().participants
    );
    $("#staffUpdate-modal .modal-body #program").val(
      snapshot.val().participants
    );
    $("#staffUpdate-modal .modal-body #skills").val(
      snapshot.val().participants
    );
    $('#staffUpdate-modal .modal-body input[name="file"]').val(
      snapshot.val().ImageName
    );
  });

  //edit page data
  $("#staffUpdate-modal .modal-footer").on(
    "click",
    "#edit-course",
    function (e) {
      e.preventDefault();
      var name = $('#staffUpdate-modal .modal-body input[name="name"]')
        .val()
        .trim();
      var teacher = $('#staffUpdate-modal .modal-body input[name="teacher"]')
        .val()
        .trim();
      var courseContent = $("#staffUpdate-modal .modal-body #courseContent")
        .val()
        .trim();
      var information = $("#staffUpdate-modal .modal-body #information")
        .val()
        .trim();
      var duration = $('#staffUpdate-modal .modal-body input[name="duration"]')
        .val()
        .trim();
      var student = $('#staffUpdate-modal .modal-body input[name="student"]')
        .val()
        .trim();
      var participants = $("#staffUpdate-modal .modal-body #participants")
        .val()
        .trim();
      var program = $("#staffUpdate-modal .modal-body #program").val().trim();
      var skills = $("#staffUpdate-modal .modal-body #skills").val().trim();

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
      const rootRef = ref(db, "course/" + editCourseKey);
      const imagesRef = sRef(storage, "course/" + imgName);

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
          teacher,
          courseContent,
          information,
          duration,
          student,
          participants,
          program,
          skills,
          ImageName: fname + ext,
          ImgUrl: URL
        });
      }
      
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
