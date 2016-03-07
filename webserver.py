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

@app.route('/castostructure', methods=['GET'])
def casToStructure():
    cas_number = request.args.get("cas")
    if(len(cas_number) > 0):
        r = requests.get("http://cactus.nci.nih.gov/chemical/structure/" + cas_number + "/smiles")
        return_obj = {}
        return_obj["status"] = "success"
        return_obj["smiles"] = r.text
        return json.dumps(return_obj)

    return_obj = {}
    return_obj["status"] = "error"
    return json.dumps(return_obj)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
