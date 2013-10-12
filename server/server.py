from bottle import route, run, template, get, post, request
import urllib
import json

@route('/', method='POST')
def commit():
    print("hello")
