import {
  db,
  set,
  ref,
  onValue,
  push,
  child,
  update,
  remove
} from "./module.js";

$("thead").on("click", ".btn-success", function () {
  $("tbody").append(`
				<tr>
					<td></td>
					<td><input id="page" type="text" class="form-control" name="new_page"/></td>
					<td>
						<button class="btn btn-success add-page"><i class="fa fa-save"></i>
						</button>
						<button class="btn btn-warning cancel"><i class="fa fa-times"></i>
						</button>
					</td>
				</tr>
				`);
});

//cancel adding page data
$("tbody").on("click", ".cancel", function () {
  $(this).parents("tr").remove();
  Nomrele();
});

//add page data
$("tbody").on("click", ".add-page", function (e) {
  e.preventDefault();
  var page = $("#page").val();
  const userId = push(child(ref(db), "pages")).key;
  var branch = ref(db, "pages/" + userId);
  set(branch, {
    page,
  });
});

//get page data
onValue(ref(db, "pages"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    $("tbody").append(`
    <tr data-id="${childKey}">
    <td></td>
    <td>${childData.page}</td>
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
  var deletePageKey = $(this).parents("tr").data("id");
  const rootRef = ref(db, "pages/" + deletePageKey);
  remove(rootRef);
  Nomrele();
});

//update page data

$("tbody").on("click", ".btn-primary", function (e) {
  e.preventDefault();
  var tr = $(this).parents("tr");
  var old_page = tr.find("td:eq(1)").text().trim();
  tr.find("td:eq(1)").html(
    `<input type="text" class="form-control" name="edit_page" value="${old_page}" />`
  );
  tr.find("td:eq(1)").attr("old-page", old_page);
  tr.find("td:eq(2)").html(`
				<button class="btn btn-success edit-page"><i class="fa fa-save"></i>
				</button>
				<button class="btn btn-warning reset"><i class="fa fa-times"></i>
				</button>`);

  //reset update data
  $("tbody").on("click", ".reset", function () {
    var tr = $(this).parents("tr");
    var old_page = tr.find("td:eq(1)").attr("old-page");
    tr.find("td:eq(1)").text(old_page);
    tr.find("td:eq(2)").html(`
          <button class="btn btn-primary"><i class="fa fa-pencil"></i>
          </button>
          <button class="btn btn-danger"><i class="fa fa-trash"></i>
          </button>`);
  });

  //edit page data
  $("tbody").on("click", ".edit-page", function () {
    var tr = $(this).parents("tr");
    var editPageKey = $(this).parents("tr").data("id");
    console.log(editPageKey);
    var page = tr.find('input[name="edit_page"]').val().trim();
    const rootRef = ref(db, "pages/" + editPageKey);
    update(rootRef,{page});
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
