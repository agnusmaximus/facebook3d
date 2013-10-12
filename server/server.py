from bottle import route, run, template, get, post, request, static_file
import urllib
import json

@route('/<filename>')
def return_resouce(filename):
    return static_file("src/" + filename, root='../')

@route('/', method='GET')
def commit():
    return static_file("src/home.html", root='../')

run(host='localhost', port=8080)
