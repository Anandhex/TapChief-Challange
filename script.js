const stopwords = [
  "a",
  "and",
  "around",
  "every",
  "for",
  "from",
  "in",
  "is",
  "it",
  "not",
  "on",
  "one",
  "the",
  "to",
  "under"
];

function containsId(docs, id) {
  let doc = docs.filter(d => d.id === id)[0];
  if (doc) {
    let newdoc = {
      ...doc,
      occurence: doc.occurence + 1
    };

    docs[id] = newdoc;
    return docs;
  } else {
    doc = {
      id,
      occurence: 1
    };
    docs.push(doc);
    return docs;
  }
}
var invertTables = [];
var invertId = 0;
function pushVal(table, word, documentId) {
  let flag = 1;
  
  if (table.length === 0) {
    table.push({
      id: invertId,
      word: word,
      documentId: [
        {
          id: documentId,
          occurence: 1
        }
      ]
    });
    invertId++;

    return table;
  }
  ///something changed

  table.forEach((doc, idx) => {
    if (doc.word === word) {
      doc = {
        ...doc,
        documentId: containsId(doc.documentId, documentId)
      };

      table.splice(idx, 1, doc);
      flag = 0;
      break;
    }
  });

  if (flag) {
    table.push({
      id: invertId,
      word: word,
      documentId: [
        {
          id: documentId,
          occurence: 1
        }
      ]
    });
    invertId++;
  }
  return table;
}

function index() {
  invertTables = [];
  invertId = 0;
  var body = document.querySelector("textarea").value;
  var documents = body.split("\n\n");
  var doc_objects = documents.map((document, idx) => {
    return {
      id: idx,
      words: document
        .split(" ")
        .filter(word => stopwords.indexOf(word.toLowerCase()) === -1)
    };
  });

  doc_objects.forEach((obj, idx) => {
    let { words, id } = obj;

    words.forEach(word => {
      pushVal(invertTables, word.toLowerCase().replace(/[^a-zA-Z ]/g, ""), id);
    });
  });
}

function search() {
  var key = document.querySelector("#search").value;
  let docId = invertTables.filter(doc => {
    return doc.word === key;
  })[0];
  let doc = docId.documentId.sort((a, b) => b.occurence - a.occurence);
  if (docId.documentId.length > 10) {
    doc = doc.slice(0, 10);
  }
  let val = doc.map(
    d => `occurrend at document${d.id} at times ${d.occurence}\n`
  );
  document.querySelector("#val").innerHTML = val;
}

function clear() {
  invertTables = [];
  invertId = 0;
}
