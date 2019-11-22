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
$("#btn-clear").on("click", () => {
  $.get("/api/clear").then(data => setSearch(data));
});

function setSearch(data) {
  if (data.success === "cleared") {
    invertTables = data.invertTable;
    $("#res").empty();
    $("#result").empty();
    $("#res").append("<span>Data removed<span>");
    $("textarea").val("");
  } else if (!data.err && !data.success) {
    $("#res").empty();
    $("#res").append("<span>Data succesfully uploaded<span>");
    invertTables = data;
  } else if (data.err || data.invertTable === []) {
    invertTables = [];
    $("#res").empty();
    $("#res").append(`<span style="color:red">${data.err}<span>`);
  }
}

function display(data, key) {
  $("#result").empty();
  $("#res").empty();
  $("#search").val("");
  if (!data.err && !data.dataMissing) {
    var lis = data.map(
      d =>
        `<li>Has occured ${d.occurence} times in the paragraph ${Number(d.id) +
          1}</li>`
    );
    $("#result").append(`<h2>The word: ${key}</h2>`);
  } else if (data.dataMissing) {
    lis = `<h3 style="color:red">${data.dataMissing}</h3>`;
  } else {
    lis = `<h3 style="color:red">${key} ${data.err}</h3>`;
  }

  $("#result").append(lis);
}
