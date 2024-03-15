# Internship

Objective: creating a web page ( back to front ) where i need to have a minimalist interface that will provide the user with DATA provided from a JSON. 

step1 - Research on tools and frameworks that allow me to get to my objective: 

        I had 3 choices in this matter - working on javascript || Python || PHP - where in JS i have Node.js ( with express.js ), in python i have Django and in PHP i have Laravel.
        
        My first choice was Node.js, since i already had some kind of experience in it and in javascript so i thought it would be more acssesible to work in this language. And after researching on django and laravel i realized that to reach my goal in the most clean way, Node.js is the right choice. During the research i saw that using Express.js is so much more minimalist than the other options. 

        Final Choice on step1 - Javascript framework: Node.js with Express.js 

Step 2 - research on ways to deal with a JSON file with Node.js 

        I am expecting to receive a JSON file trough the use of an API (rest api or fetch) and im getting it in the format of a string because it's easier to make strings travel because they take up less space than a complete JSON for example. 
        After receiving the DATA i have to parse it using json.parse - this fuction returns a javascript object.
        Example: cost data = `"name": "Ruben", "age": 24`
                 const obj = json.parse(data)
                 obj = {"name": "Ruben", "age": 24}

        To turn it back into a string (if i wanted to send it back for example) i would use json.stringify


Step 3 - API??? 

        Research promises -> async/await -> fetch