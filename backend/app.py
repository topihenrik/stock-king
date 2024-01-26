from flask import Flask
import utils

app = Flask(__name__)

@app.route("/api")
def hello_world():
    return f"<p>{utils.hello_world()}</p>"

@app.post("/api/test")
def test_function():
    return True