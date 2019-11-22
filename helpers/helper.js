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

//for checking whether the word is already present in the document and updating accordingly

function containsId(docs, id) {
  let doc, idx;
  // checking for the document
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

// adding the value to the inverted table
function pushVal(table, word, documentId) {
  let flag = 1;
  // checking if empty
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
  // checking if the word is present in the table
  for (let i = 0; i < table.length; i++) {
    let doc = table[i];
    if (doc.word === word) {
      doc = {
        ...doc,
        documentId: containsId(doc.documentId, documentId) //updating the documentID
      };
      table.splice(i, 1, doc); //updating the table
      flag = 0;
      break;
    }
  }
  // if the word is not found
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

function preprosing(texts) {
  // removing any special characters other than newline character
  texts.replace(/[&#,+()$~%.'":*?<>{}]/g, "").trim();

  //  splitting the document
  var documents = texts
    .split("\n\n")
    .map(text => text.trim().replace(/\n/g, " ")); //replacing carige return with empty space

  // removing from the document if it contains stop words
  var doc_objects = documents.map((document, id) => {
    return {
      id,
      words: document
        .split(" ")
        .filter(word => stopwords.indexOf(word.toLowerCase()) === -1)
    };
  });
  return doc_objects;
}

exports.index = function(texts) {
  invertTables = [];
  invertId = 0;

  // preprocessing
  let doc_objects = preprosing(texts);

  // building up the invertTable
  doc_objects.forEach(obj => {
    let { words, id } = obj;

    words.forEach(word => {
      pushVal(invertTables, word.toLowerCase(), id);
    });
  });
  return invertTables;
};
exports.search = function(key, invertTables) {
  // converting user input to lowercase and removing any special characters
  key = key
    .replace(/[&#,+()$~%.'":*?<>{}]/g, "")
    .replace(/\n/g, " ")
    .toLowerCase();

  // searching for the word
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
    return { err: "word is not present" }; //if the word not found
  }
};

module.exports = exports;
