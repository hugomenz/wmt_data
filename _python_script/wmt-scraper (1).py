import time
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pytz



# -- Carga FireBase aplicacion
cred = credentials.Certificate("wmt-scraper-firebase-adminsdk-5ve67-5dde962c44.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
# --

def getData(url):
  page = requests.get(url)
  print(url)
  print("request done")
  soup = BeautifulSoup(page.content, "html.parser")

  return json.loads(soup.text)

def save(collection_id, document_id, data):
    db.collection(collection_id).document(document_id).set(data)

def sleep_until(target):
    now = datetime.now(pytz.timezone('UTC')).replace(tzinfo=None)
    delta = target - now

    if delta > timedelta(0):
        time.sleep(delta.total_seconds())
        return True


def now_UCT_timestamp():
    now = datetime.now(pytz.timezone('UCT'))

    return {
        "year": now.year,
        "month": now.month,
        "day": now.day,
        "hour": now.hour,
        "minute": now.minute,
        "second": now.second
    }



air_nodes_api_url = " https://api.wmtscan.com/json/air-nodes"
network_api_url = "https://api.wmtscan.com/json/network"

k =60 # timedelta minutes
print("="*50)
print("-"*50)
print("-      W M T   D A T A   S C R A P E R      -")
print("-"*50)

while True:

    now = now_UCT_timestamp()
    target = datetime(now['year'], now['month'], now['day'], now['hour'], 0, 0) + timedelta( minutes = k )
    print(f'Waiting till {target} to run')
    sleep_until(target)


    air_nodes_data = getData(air_nodes_api_url)
    network_data = getData(network_api_url)

    print("")
    print("--- request done!  -- OK!")

    tz = pytz.timezone('Europe/Berlin')
    timestamp = datetime.now(tz).strftime("%d-%m-%Y %H:%M:%S")

    export_data = {
        "timestamp": timestamp,
        "airnodes": len(air_nodes_data),
        "network_usage": network_data['bytes'],
        "users": network_data['users']
    }


    with open("output.json", "a") as data:
        json.dump(export_data, data, indent=4)
        data.close()

    try:
      save(collection_id="WMT Scan Scraper",
          document_id=f"{timestamp}",
          data=export_data)

      print("")
      print(">>> guardado! -- OK!")
      print("-"*50)
      print(export_data)
      print("-"*50)

    except:
        pass # doing nothing on exception




    if k < 60:
        k = k + 15 ## Ponerlo a 15 minutos

    else:
        k = 15
    print(f'[ {k} ]')


    print("="*50)
