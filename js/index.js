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

//get page data
onValue(ref(db, "pages"), (snapshot) => {
  $("tbody").empty();
  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    if (childData.visible) {
      $("tbody").append(`
    <tr data-id="${childKey}">
    <td></td>
    <td>${childData.page}</td>
    <td>
    <button class="btn btn-secondary"><i class="fa-solid fa-eye"></i>
    </button>
    </td>
    </tr>
`);
    } else {
      $("tbody").append(`
  <tr data-id="${childKey}">
  <td></td>
  <td>${childData.page}</td>
  <td>
  <button class="btn btn-secondary"><i class="fa-solid fa-eye-slash"></i>
  </button>
  </td>
  </tr>
`);
    }
  });
  Nomrele();
});
/* <i class="fa-solid fa-eye-slash"></i> */
$("tbody").on("click", ".btn-secondary", function (e) {
  e.preventDefault();
  var visible;
  var editPageKey = $(this).parents("tr").data("id");
  console.log(editPageKey);
  onValue(ref(db, "pages/" + editPageKey), (snapshot) => {
    visible = snapshot.val().visible;
  });
  console.log(visible);
  if (visible) {
    $(this).parents("tr").find(".btn").empty();
    $(this)
      .parents("tr")
      .find(".btn")
      .append(`<i class="fa-solid fa-eye-slash"></i>`);
    const rootRef = ref(db, "pages/" + editPageKey);
    update(rootRef, { visible: false });
  } else {
    $(this).parents("tr").find(".btn").empty();
    $(this)
      .parents("tr")
      .find(".btn")
      .append(`<i class="fa-solid fa-eye"></i>`);
    const rootRef = ref(db, "pages/" + editPageKey);
    update(rootRef, { visible: true });
  }
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
