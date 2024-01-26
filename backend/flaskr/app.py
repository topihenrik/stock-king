from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flaskr import utils

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='static')
CORS(app, resources={r'/*' : {'origins': ['*']}})

@app.route("/api")
def hello_world():
    return f"<p>{utils.hello_world()}</p>"

@app.route("/api/lorem_ipsum")
def lorem_ipsum():
    return jsonify(utils.lorem_ipsum())

@app.post("/api/test")
def test_function():
    return True

@app.route('/')
def index():
    return render_template('index.html')