function clearAPI() {
  invertTables = [];
  invertId = 0;
}

let invertTables = [];
$("#index").on("click", e => {
  var body = $("textarea").val();
  $.post("/api/index", { document: body }).then(data => setSearch(data));
});

$("#btn-search").on("click", () => {
  var key = $("#search").val();
  $.post("/api/search", { key: key, invertTable: invertTables }).then(data =>
    display(data, key)
  );
});

function setSearch(data) {
  if (!data.err) {
    $("#res").empty();
    $("#res").append("<span>Data succesfully uploaded<span>");
    invertTables = data;
  } else {
    invertTables = [];
    $("#res").empty();
    $("#res").append(`<span style="color:red">No data to upload<span>`);
  }
}

function display(data, key) {
  $("#result").empty();
  $("#res").empty();
  if (!data.err) {
    var lis = data.map(
      d =>
        `<li>Has occured ${d.occurence} times in the paragraph ${Number(d.id) +
          1}</li>`
    );
    $("#result").append(`<h2>The word: ${key}</h2>`);
  } else {
    lis = data.err;
  }

  $("#result").append(lis);
}
