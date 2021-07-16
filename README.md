# FinalProject_Yelp_Data_Analysis
​
Yelp Analysis Project
​
### Purpose:
Purpose of the project is to do the sentiment analysis of the YELP reviews data.
​
### Installers Used:
•	pip install textblob
•	pip install wtforms
•	pip install nltk
•	pip install psycopg2
•	nltk.download('punkt')
•	nltk.download('stopwords')
•	nltk.download('wordnet')
​
​
### Machine Language Model Used:
​
•	Logistic Regression 
•	AnyChart
•	Pickle(to save model)
​
### Reviews URL: 
https://yelp-sentiment.s3.us-east-2.amazonaws.com/yelp_academic_dataset_review.json
​
### Business Data URL: 
https://data-bootcamp-priya.s3.us-east-2.amazonaws.com/yelp_academic_dataset_business.json* The initial dataset is downloaded from Kaggle with 8 million records approximately. The file is placed in S3 bucket in AWS.
* Using pySpark, the file is retrieved from AWS and cleaned up and filtered for all the states only in US. Finally the cleaned data with 6 million records is loaded into the POSTGRESQL database on AWS.
​
### Sample code to write the data frame into postgresql on AWS
Configuration for RDS instance
mode="append"
jdbc_url = "jdbc:postgresql://db-inst-on-aws.cdkwx2gwtmqa.us-east-2.rds.amazonaws.com:5432/db_on_aws"
config = {"user":"***",
          "password": "*****",
          "driver":"org.postgresql.Driver"}business_nonull_df.write.jdbc(url=jdbc_url, table='businessTable', mode=mode, properties=config)
​
Connection to db:
​
def connect():    # Set up a connection to the postgres server.
    conn_string = "host="+ creds.PGHOST +" port="+ "5432" +" dbname="+ creds.PGDATABASE +" user=" + creds.PGUSER \
                  +" password="+ creds.PGPASSWORD    conn = psycopg2.connect(conn_string)
    print("Connected!")    # Create a cursor object
    cursor = conn.cursor()    return conn, cursorconn, cursor = connect()sql = """SELECT * from  vancouver_pizza"""
data.business_review_df = pd.read_sql(sql, con=conn)
print("Data retrieved")
conn.close()
cursor.close()* PGHOST, PGDATABASE, PGUSER & PGPASSWORD are provided in the config.py
​
### Training Data: 
Through the ml.py file, training of data occurred to identify the sentiment of words. Data included review text in which data is trained. Using the NLTK natural language python library, stop words were removed from the data set. Then all reviews above 3 stars were coined as positive and all reviews below 3 stars were coined as negative. All 3 star reviews were dropped for ease of analysis. All punctuations, special characters and non-English words were also removed. The review text was then tokenized. The training then starts by vectorizing and using the sklearn linear regression model library. 20 percent of the data was randomly selected to start training. After the training of the model has occurred using regression analysis, using the text blob library text is classified, giving scores of polarity and subjectivity. 
​
### Flask API links:
* /find/  ==> To get the data loaded into webpage during initial load
* /findBySelect  ==> To retreive the data based on the select filter and returns json object to create map, business rating visualizations
* /findBySelectML/  ==> Link to Machine learning part of the code and returns the json object to create the wordcloudJS files:
*********
​
​
​
### Code Files:
​
WordCloud.js
Word Cloud for Results: 
This is done in the wordCloud.js file.
Using the AnyChart library, a word cloud is created from the output of the model to show the common positive and negative words used in the reviews based on the filters selected.
An additional frequency bar graph is made to show the number of times a word is written. 
​
Review.html
Analysis Model Accuracy: 
This is done in review.html.
To check the accuracy of the sentiment analysis prediction model, a separate page is created to show the model in its working form. When text is typed in, the model is run in the back end and shows if the text is positive or negative with an accuracy percentage displayed. 
​
Business.js
In order to display the average rating for each business a js file is created that calls the selected data in a function. Then an empty JS object is created. Via for loop we are collected the business name, date and review stars on that date in lists. Only the year is extracted from the date. Then the lists are pushed to the object. Using d3 nesting, we get the mean review for each year. This is stored in line Visual function and called in the business.js file. Here the data is charted using plotly.
​
​
CategoriesFilter.js
This file reads the JSON files for YELP categories and US City and state and populates the search dropdown. On selecting of these dropdowns, the data for the business cards will be updated to fetch the business for the city, state and category.
​
MapLogic.Js
This uses the leaflet library to plot mark the locations of the selected city. 
Business.js 
This file has the logic to create the business within the collapsible card on html at runtime based on the dataset received from database. This plots bar plots with review stars distribution. The business can also be sorted either in ascending/descending order.
​
ReadInput.js 
This file has the logic to create dictionary with the required columns like name, review count, count distribution across start. The dictionary is send to business.js
​
Yearly_review.js 
Year over year change in rating for each business is calculated and send to business.js to get plotted within the collapsible.
​