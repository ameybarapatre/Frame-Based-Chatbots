

## Pizza Ordering Chat Bot 


It is a frame based bot developed using IBM Conversation API it uses a NodeJS and CloudantDB backend, Although not the highlight of the application but a key functionality, it can help the user order from the following simplified menu: 

1. Pizza
	* With pepperoni
	* 4 cheese
	* Spinach and tomato
	* sausage
2. Salads
	* Garden Salad
	* Caesar salad
3. Sides
	* Breadsticks
4. Drinks
	* Fountain drink
		* Coke


<img src = "https://raw.githubusercontent.com/ameybarapatre/chatbots/master/image1.png" width="700px" />

<img src = "https://raw.githubusercontent.com/ameybarapatre/chatbots/master/image2.png" width="700px" />


IBM conversation API provides the dialog flow for the frames also helps detect entities and user intent. With fuzzy matching feature on the app is resilient to misspells. One less thing to worry about.

### Key Feature - Order Items Counting: (Counter.js)

I used the Stanford Parser to do a dependency parse of the user input if the detected intent is #order and use the nmod dependecy to recognise a numerical modifier.

A simple parse will lead to erroneous result for example:

#### "I want two cheese pizzas"

The nmod dependency would be recognised as:
#### nmod(two,pizzas)
which is not correct. To solve this issue i used the information sent by the conversation API about where the entity has been located and remove the overlapping entities from the list of entites. Then I replace the remaining entities in the text with custom contractions example:  
#### Cheeze Pizza -> cpz 

So the above example sentence becomes: 

#### "I want two cpz"

Now the recognised dependency would be:
#### nmod(two,cpz)
I then use contractions to convert the numbers in words to numbers (feasible since only limited number of items can be ordered).
I create a list of items and their counts from this. Also, I add the entities that have not been recognised with a depedency or a 'det' into the aforementioned list.

Finally the order is compiled and stored in the cloudant store.




## Note : 
I run the corenlp server jar to which accepts API requests for parses and responds with a JSON of parsed text.
Run this to start the server in the StanfordCoreNLP directory:

java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000

Due to this requirement the application deployed on the cloud cannot count the order and track it but it can still have a complete ordering scenario conversation. Link to the application:

[Pizzabot](http://conversation-simple-tes1.mybluemix.net/)

### Some sandbox chatbots I created :

[WeatherBot](http://weatherus.mybluemix.net/)
[FoodCoachBot](http://food-coacher.mybluemix.net/)










