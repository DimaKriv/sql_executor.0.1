You have to implement a Rich Internet application, using the following technologies:  
 - Dojo JavaScript framework v1.12 (http://dojotoolkit.org/) on the client side 
 - JAX-RS based RESTful services on the server side  
Server code must run on Tomcat or Oracle or WebSphere application server. Servlet container is
sufficient for implementation of the task.  
The application must:  
 - allow to specify and execute SQL statements  
 - visualize result in case of SELECT statements  
 - visualize returned SQL status for INSERT and UPDATE statements (number of inserted
or deleted rows)  
 - visualize returned SQL errors in user-friendly manner  
 - display the history of executed statements (within single session)  

The GUI of the application must look as follows. DGrid is used to show executed SQL
statements.  

![alt text](https://raw.githubusercontent.com/DimaKriv/sql_executor.0.1/master/task_jpg1.jpg)

"..." on the image above identifies not specified in this example part of the SQL statement. In the
implementation the entire specified by the user SQL statement should be displayed.  
"Add new" should show a modal (i.e with overlay in background) dialog like:  

![alt text](https://raw.githubusercontent.com/DimaKriv/sql_executor.0.1/master/task_jpg2.jpg)

Pressing ">" arrow on the right side of each row should execute the query and visualize results.
Results must be visualized using DGrid component, similar to main view of the application. The
difference is that for visualization columns must be dynamically created depending on query
output.  
Error handling (overlay to disable GUI of the application is mandatory):  

![alt text](https://raw.githubusercontent.com/DimaKriv/sql_executor.0.1/master/task_jpg3.jpg)

Please additionally implement an algorithm to reverse the order of words in a sentence. Use your
RESTful service to execute it on server side. Do not allocate additional string buffers for resulting
sentence, do it in-place. Use editbox for specifying original sentence, a button to run the algorithm
and a read-only editbox to display the result (see the first image).  
Dojo project must be assembled according to Dojo guidelines.  
Java code should be documented according to JavaDoc notation preferably using grammatically
correct English. It would be nice to have YAML documentation of implemented RESTful service.  
Code must be properly documented preferably using grammatically correct English 
