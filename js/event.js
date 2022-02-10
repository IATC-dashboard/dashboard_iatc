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
    var title = $('#staff-modal .modal-body input[name="title"]').val().trim();
    var textarea = $('#staff-modal .modal-body #eventContent').val().trim();
    var photo = $('#staff-modal .modal-body input[name="file"]').val().trim();
    const userId = push(child(ref(db), "events")).key;
    var branch = ref(db, "events/" + userId);
    set(branch, {
      title,
      textarea,
      photo
    });
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
        <tr data-id="${childKey}">
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
          console.log(snapshot.val().photo)
                $('#staffUpdate-modal .modal-body input[name="title"]').val(snapshot.val().title);
                $('#staffUpdate-modal .modal-body #eventContent').val(snapshot.val().textarea);
                $('#staffUpdate-modal .modal-body input[name="file"]').val(snapshot.val().photo);
            });
   
    // //edit page data
    $("#staffUpdate-modal .modal-footer").on("click", "#edit-event", function (e) {
        e.preventDefault();
        var title = $('#staffUpdate-modal .modal-body input[name="title"]').val().trim();
        var textarea = $('#staffUpdate-modal .modal-body #eventContent').val().trim();
        var photo = $('#staffUpdate-modal .modal-body input[name="file"]').val().trim();
  
      const rootRef = ref(db, "events/" + editEventKey);
      update(rootRef,{
          title,
          textarea,
          photo
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
  