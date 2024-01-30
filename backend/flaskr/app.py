from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
from flaskr import utils
import os

app = Flask(__name__, static_folder='static', template_folder='static')
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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    if os.environ.get('ENV') != None and os.environ.get('ENV') == 'prod':
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    return ''