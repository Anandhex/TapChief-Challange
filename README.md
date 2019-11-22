# TapChief-Challange

Instructions to use TapSearch
  
  1.Enter the text or document in the given text box, for which the word has to be searched.
  
  2.After entering the data. Click on the upload button to send the data to the server via api.
  
  3.You will prompted with the message whether data was uploaded or not.
  
  4.After getting the message. Enter the word in the search box to be searched and click on the search button.
  
  5.You will be displayed the occurence of the word.
  
  6.To clear the invert table. click on the clear button.
  
  Things to keep in mind.
  
    1.Each paragraph is sepearted by two newline characters only.
    
    2.Stop words aren't allowed. 
    
      List of stopwords is present in this webpage https://www.ranks.nl/stopwords
    
    3. Result is returened in the order of most occurence. Top documents are the documents with higher number of word occurence.
       If the words have occurred in different documents i.e, more than 10 documents contain the word.
       Then only the list with top 10 documents will be reterived.
