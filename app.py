from flask import Flask, jsonify, request, redirect

from flask import render_template, url_for
from flask.wrappers import Response
from flask_cors import CORS
import requests

import json
from bson import json_util
from bson.json_util import dumps
from requests import sessions

import psycopg2
import config as creds
import pandas as pd

from flask import Flask, render_template, request
from wtforms import Form, TextAreaField, validators
import pickle
import sqlite3
import os
import numpy as np
#from sklearn.externals import joblib
#import sklearn.external.joblib as extjoblib
import joblib
import ml

app = Flask(__name__)
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

def connect():
    
    # Set up a connection to the postgres server.
    conn_string = "host="+ creds.PGHOST +" port="+ "5432" +" dbname="+ creds.PGDATABASE +" user=" + creds.PGUSER \
                  +" password="+ creds.PGPASSWORD
    
    conn = psycopg2.connect(conn_string)
    print("Connected!")

    # Create a cursor object
    cursor = conn.cursor()
    
    return conn, cursor

class DataStore:
    global business_review_df

data = DataStore()

def getDBData(state, category, city):
    print("category inside getdbdata" + state)
    print("category inside getdbdata" + category)
    print("category inside getdbdata" + city)
    # state_list = []
    # if state not in state_list:
    #     business_not_found_df = "Null"
    #     return business_not_found_df
    # else:
    conn, cursor = connect()
    # tablename = 'business_'+state
    # sql = """SELECT * from vancouver_pizza """
    sql = """SELECT * from vancouver_pizza"""
    data.business_review_df = pd.read_sql(sql, con=conn)
    print("Data retrieved")
    conn.close()
    cursor.close()
    return data.business_review_df



@app.route("/")
def index():
    
  
    return render_template("index.html")

@app.route('/find/')
def find():
    
    conn, cursor = connect()
    sql = """SELECT * from vancouver_pizza """
    data.business_review_df = pd.read_sql(sql, con=conn)
    print("Data retrieved")
    conn.close()

    json_project = data.business_review_df.to_json(orient = 'records')
    return json_project

# feature_transformation(data.business_review_df)

@app.route("/findBySelect" , methods=['GET','POST'])
def findBySelect():
    print("Inside App")
    state = request.args['state']
    category = request.args['category']
    city = request.args['city']
    print(str(category))
    print(str(city))

    df = getDBData(state, category, city)
    json_project = df.to_json(orient = 'records')
  
    return json_project

@app.route("/findBySelectML/")
def findBySelectML():
    print("Inside ML App")
    # category = request.args['category']
    # city = request.args['city']
    # print(str(category))
    # print(str(city))

    #df = getDBData()
    # if (data.business_review_df.isnull().values.any()):
    wc_df = ml.feature_transformation(data.business_review_df)
    print("Wordcloud output")
    print(wc_df)  
    json_project = wc_df.to_json(orient = 'records')

    return json_project
    # else:
    #     return redirect ("/find",302)



########Review.html related code#############
#Load the models
loaded_model = joblib.load("./models/model.pkl")
loaded_stop = joblib.load("./models/stopwords.pkl")
loaded_vec = joblib.load("./models/vectorizer.pkl")


def classify(document):
    label = {-1: 'negative', 1: 'positive'}
    X = loaded_vec.transform([document])
    y = loaded_model.predict(X)[0]
    proba = np.max(loaded_model.predict_proba(X))
    return label[y], proba


class ReviewForm(Form):
    yelpreview = TextAreaField(' ', [validators.DataRequired(), validators.length(min=15)])



@app.route('/review', methods=['GET', 'POST'])
def index_func():
    if request.method == 'POST':
        # do stuff when the form is submitted
        # redirect to end the POST handling
        # the redirect can be to the same route or somewhere else
        return redirect(url_for('index'))
    # show the form, it wasn't submitted
    return render_template('review.html')



@app.route('/reviews', methods=['POST'])
def results():
    form = ReviewForm(request.form)
    #print(form)
    review = "check"
    if request.method == 'POST' and form.validate():
        review = request.form['yelpreview']
        print(review)
    y, proba = classify(review)
    print(y)
    print(proba)
    return render_template('review.html', form=form, content=review, prediction=y, probability=round(proba*100, 2))

########Review.html related code ends here#############


if __name__ == '__main__':
    app.run(debug=True)