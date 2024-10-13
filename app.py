from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords
import pandas as pd

nltk.download('stopwords')

app = Flask(__name__)


# TODO: Fetch dataset, initialize vectorizer and LSA here


groups = fetch_20newsgroups(subset='all')
docs = groups.data
stop_words = stopwords.words('english')

vectorizer = TfidfVectorizer(stop_words=stop_words)

x = vectorizer.fit_transform(docs)
model = TruncatedSVD(n_components=100)
x_lsa = model.fit_transform(x)


def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    # TODO: Implement search engine here

    query_vec = vectorizer.transform([query])

    query_lsa = model.transform(query_vec)

    similarities = cosine_similarity(query_lsa, x_lsa)

    top_indices = similarities.argsort()[0][-5:][::-1]
    top_similarities = [similarities[0][i] for i in top_indices]
    top_docs = [docs[i] for i in top_indices]

    return top_docs, top_similarities, top_indices.tolist()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    documents, similarities, indices = search_engine(query)
    return jsonify({'documents': documents, 'similarities': similarities, 'indices': indices}) 

if __name__ == '__main__':
    app.run(debug=True)
