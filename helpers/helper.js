const stopwords = [
  "a",
  "an",
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
var invertTables = [];
var invertId = 0;

function containsId(docs, id) {
  let doc, idx;

  for (let i = 0; i < docs.length; i++) {
    let d = docs[i];
    if (d.id === id) {
      idx = i;
      doc = d;
    }
  }

  if (doc) {
    let newdoc = {
      ...doc,
      occurence: doc.occurence + 1
    };
    docs[idx] = newdoc;
    return docs;
  } else {
    doc = {
      id: id,
      occurence: 1
    };
    docs.push(doc);
    return docs;
  }
}

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

  for (let i = 0; i < table.length; i++) {
    let doc = table[i];
    if (doc.word === word) {
      doc = {
        ...doc,
        documentId: containsId(doc.documentId, documentId)
      };
      table.splice(i, 1, doc);
      flag = 0;
      break;
    }
  }

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

exports.index = function(texts) {
  invertTables = [];
  invertId = 0;
  texts = texts.replace(/[&#,+()$~%.'":*?<>{}]/g, "").trim();

  var documents = texts
    .split("\n\n")
    .map(text => text.trim().replace(/\n/g, " "));

  var doc_objects = documents.map((document, id) => {
    return {
      id,
      words: document
        .split(" ")
        .filter(word => stopwords.indexOf(word.toLowerCase()) === -1)
    };
  });

  doc_objects.forEach(obj => {
    let { words, id } = obj;

    words.forEach(word => {
      pushVal(invertTables, word.toLowerCase(), id);
    });
  });
  return invertTables;
};
exports.search = function(key, invertTables) {
  let word = invertTables.filter(doc => {
    return doc.word === key;
  })[0];
  if (word) {
    let doc = word.documentId.sort((a, b) => b.occurence - a.occurence);
    if (word.documentId.length > 10) {
      doc = doc.slice(0, 10);
    }
    return doc;
  } else {
    return "Word is not present";
  }
};

module.exports = exports;
