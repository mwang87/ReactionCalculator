import os
from flask import Flask, request, redirect, url_for, send_file, render_template
import json
import requests

app = Flask(__name__, static_folder='static')


@app.route('/', methods=['GET'])
def renderhomepage():
    return render_template('homepage.html')

@app.route('/castoformula', methods=['GET'])
def casToFormula():
    cas_number = request.args.get("cas")
    if(len(cas_number) > 0):
        r = requests.get("http://cactus.nci.nih.gov/chemical/structure/" + cas_number + "/formula")
        return_obj = {}
        return_obj["status"] = "success"
        return_obj["formula"] = r.text
        return json.dumps(return_obj)


    return_obj = {}
    return_obj["status"] = "error"
    return json.dumps(return_obj)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
