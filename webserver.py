import os
from flask import Flask, request, redirect, url_for, send_file, render_template
import json

app = Flask(__name__, static_folder='static')


@app.route('/', methods=['GET'])
def renderhomepage():
    return render_template('homepage.html')

@app.route('/testapi', methods=['GET'])
def testapi():
    return_obj = {}
    return_obj["status"] = "success"
    return json.dumps(return_obj)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
