from enum import Flag
from pickle import STRING
from nltk.corpus.reader import string_category
import psycopg2
import config as creds
import pandas as pd
from langdetect import detect
import joblib
# def connect():
#     # Set up a connection to the postgres server.
#     conn_string = "host="+ creds.PGHOST +" port="+ "5432" +" dbname="+ creds.PGDATABASE +" user=" + creds.PGUSER \
#                   +" password="+ creds.PGPASSWORD
#     conn = psycopg2.connect(conn_string)
#     print("Connected!")
#     # Create a cursor object
#     cursor = conn.cursor()
#     return conn, cursor
# # Connecting to DB
# conn, cursor = connect()
# # # SQL command to create inventory table
# # # Execute SQL Command and commit to DB
# sql1 = """SELECT * FROM businessreviewtable where city = 'Vancouver' and categories like '%Pizza%'  """
# df=pd.read_sql(sql1, con=conn)
#sentiment analysis 

#BAR GRAPH
# df.review_stars.unique()
#How many unique star values are there
# df.review_stars.value_counts()

# import matplotlib.pyplot as plt
# #Let's see the distribution of each star rating as a pie chart
# #This way we can see that most of our data contains positive comments by costumers
# plt.figure(figsize=(8,8))
# df['review_stars'].value_counts().plot.pie(startangle=60)
# plt.title('Star Ratings')


# import seaborn as sns
# x=df['review_stars'].value_counts()
# x=x.sort_index()
# plt.figure(figsize=(10,6))
# ax= sns.barplot(x.index, x.values, alpha=0.8)
# plt.title("Star Rating Distribution")
# plt.ylabel('count')
# plt.xlabel('Star Ratings')
# rects = ax.patches
# labels = x.values
# for rect, label in zip(rects, labels):
#     height = rect.get_height()
#     ax.text(rect.get_x() + rect.get_width()/2, height + 5, label, ha='center', va='bottom')
# plt.show();
# plt.close();

# df = pd.read_csv("static/data/Vancouver_pizza.csv")

import copy
from nltk.corpus import stopwords 
from tqdm import tqdm
from nltk.corpus import wordnet as wn
from nltk.stem.wordnet import WordNetLemmatizer
#from nltk.stem import WordNetLemmatize
def lema_stopw(data_l):
    var2 = copy.deepcopy(data_l)
    lemmatizer = WordNetLemmatizer()
    # stop_words = set(stopwords.words('english')) - set(['no', 'not'])
    stop_words=set(stopwords.words('english'))
    for index, row in tqdm(var2.iterrows()):
        sent = ''
        for e in row["review_text"].split():
            if e not in stop_words:
                e = lemmatizer.lemmatize(e, pos ="a")
                sent = ' '.join([sent,e])
        var2["review_text"][index] = sent
    joblib.dump(stop_words,'stopwords.pkl') 
    return(var2)

def feature_transformation(df):
    #Categorize the reviews, dropping the neutrals
    print("Inside ML")
    df = df[df['review_stars'] != 3]
    df['sentiment'] = df['review_stars'].apply(lambda rating : +1 if rating > 3 else -1)

    #new_df is df with only 4 columns
    new_df= df[['review_stars', 'sentiment','review_text','business_id']]
    new_df['review_text']=new_df['review_text'].str.lower()
    #change all strings to be lower
    new_df['review_text']=new_df['review_text'].str.replace('[^\w\s]','')
    #get rid of unwanted characters such as punctuation marks
    new_df['review_text']=new_df['review_text'].str.replace('\d+','') 
    #removing numerals
    new_df['review_text']=new_df['review_text'].str.replace('\n',' ').str.replace('\r','')

    print("DF created")


    #removes all none english
    #pd.set_option('display.max_colwidth', None)
    from langdetect import detect
    #import detect function from langdetect
    #nonen=new_df[new_df['review_text'].apply(detect)!='en']
    #nonen is the dataframe of non-english user reviews

    #pd.set_option('display.max_colwidth', None)
    yelp=new_df[new_df['review_text'].apply(detect)=='en']
    #yelp is the data frame we will continue to work on.

    #yelp only contains English reviews,YELP IS DF WITH PUNCTIONS REMOVED AND NON-ENGLISH CHARACTERS REMOVED
    #yelp


    #TOKENIZING TO REMVE STOPWORDS

    import nltk

    yelp['review_text']=yelp['review_text'].str.replace('[^a-zA-Z]',' ')
    yelp['clean_text'] = yelp['review_text'].apply(lambda x: nltk.word_tokenize(x) ) 


    yelp["clean_text"]= yelp["clean_text"].str.join(" ")
    #yelp

    

    data_review_rest_2 = lema_stopw(yelp)
    # return data_review_rest_2
    print("Completed tokenising")


#data_review_rest_2 is final df with four columns and the review text is tokenized with stopwrds removed

# def training(data_review_rest_2):
    #TRAINING
    #create new df for training
    training_df = data_review_rest_2[['review_text','sentiment','business_id']]
    training_df.head()

    import numpy as np
    # random split train and test data
    index = training_df.index
    training_df['random_number'] = np.random.randn(len(index))
    train = training_df[training_df['random_number'] <= 0.8]
    test = training_df[training_df['random_number'] > 0.8]

    # print(train)
    # print(test)

    # count vectorizer:
    from sklearn.feature_extraction.text import CountVectorizer
    vectorizer = CountVectorizer(token_pattern=r'\b\w+\b')
    train_matrix = vectorizer.fit_transform(train['review_text'])
    test_matrix = vectorizer.transform(test['review_text'])
    joblib.dump(vectorizer,'vectorizer.pkl')

    # Logistic Regression
    from sklearn.linear_model import LogisticRegression
    lr = LogisticRegression()

    #split and train and testing data 
    X_train = train_matrix
    X_test = test_matrix
    y_train = train['sentiment']
    y_test = test['sentiment']

    #fit model 
    lr.fit(X_train,y_train)
    joblib.dump(lr,'model.pkl')

    #make predictions 
    predictions = lr.predict(X_test)
    print(predictions)

    # # find accuracy, precision, recall:
    # from sklearn.metrics import confusion_matrix,classification_report
    # new = np.asarray(y_test)
    # confusion_matrix(predictions,y_test)

    #get accuracy by printing classification report
    # print(classification_report(predictions,y_test))
    # return (classification_report(predictions,y_test))

#Analysis

# def polarity(data_review_rest_2):
    #Text Blob to idenfiy polarity of review Text 

    from textblob import TextBlob, Word, Blobber
    from textblob.classifiers import NaiveBayesClassifier
    from textblob.taggers import NLTKTagger

    data_review_rest_2['polarity'] = data_review_rest_2['review_text'].apply(lambda x: TextBlob(x). sentiment)
    #applt textblob sentiment to yelp text column
    #and assign it to a new column named polarity
    sentiment_series = data_review_rest_2['polarity'].tolist()

    data_review_rest_2[['polaarity','subjectivity']]=pd.DataFrame(sentiment_series,
        index=data_review_rest_2.index)
    data_review_rest_2.drop('polarity', inplace=True, axis=1)
    #split the list into two and create two new columns
    #assign the return values of sentiment function;
    #polarity and subjectivity to those columns
    # return data_review_rest_2

#Visualization
#Word Cloud

# from wordcloud import WordCloud
# wc = WordCloud( background_color="white", colormap="Dark2",
#                max_font_size=150, random_state=42)

# def wordcloud_5star(data_review_rest_2): 
    text_5_star=data_review_rest_2[data_review_rest_2['review_stars']>3]
    # text_5_star
    text_5_star_review = " ".join(review for review in text_5_star.review_text)
    # text_5_star_review
    option = 1
    send_dict = create_dict(text_5_star_review, option)
    # return send_dict
    print("Word clud positive words")
# def wordcloud_1star(data_review_rest_2): 
    text_1_star=data_review_rest_2[data_review_rest_2['review_stars']<3]
    # text_1_star
    text_1_star_review = " ".join(review for review in text_1_star.review_text)
    option = 2
    send1_dict = create_dict(text_1_star_review, option)
    # return send1_dict

    #Merge two df's --- positive & negative words
    final_df = send_dict.append(send1_dict, ignore_index= True)
    print("Final df")
    print(final_df)
    return final_df

def create_dict(text_5_star_review, option):
    str  = text_5_star_review.split()
    
    if(option == 1):
        flag = "positive"
    else:
        flag = "negative"

    str2 = []
    list_review = []
    # loop till string values present in list str
    for i in str:             
            # checking for the duplicacy
        if i not in str2:
    
                # insert value in str2
            str2.append(i) 
                
    for i in range(0, len(str2)):
        dict_review = {}
        dict_review["x"]=str2[i]
        dict_review["value"] =str.count(str2[i])
        dict_review["Option"] = flag
        list_review.append(dict_review)
    
    df = pd.DataFrame(list_review,columns=["x","value","Option"])
    df =df.sort_values("value", ascending = False)
    df = df.head(100)

    #print (list_review)
    return (df)




# clean_table= feature_transformation(df)
# print("Feature Transformation completed")
# training_output = training(clean_table) # O/p is trained model
# print("Training completed ")
# polarity_output = polarity(clean_table) # O/p is polarity & subjectivity
# print("Polarity completed")
# word_cloud_5_output = wordcloud_5star(polarity_output) #o/p is dictionary i/p to create_dict
# word_cloud_1_output = wordcloud_1star(polarity_output)
# print("word cloud output")

# print("Dictionary created")
# word_cloud_5_output.to_csv("file.csv", index = False)

# #output_5_df & output_1_df are inputs to word cloud