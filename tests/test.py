import requests
import sys

filename = input("filename=")

log_service_url = "http://localhost:4001"
user_service_url = "http://localhost:4002"
cost_service_url = "http://localhost:4003"
about_service_url = "http://localhost:4004"

output = open(filename, "w")
sys.stdout = output

print("Log Service URL: " + log_service_url)
print("User Service URL: " + user_service_url)
print("Cost Service URL: " + cost_service_url)
print("About Service URL: " + about_service_url)
print()

print("testing getting the about")
print("-------------------------")
try:
    text = ""
    url = about_service_url + "/api/about/"
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(data.json())
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing getting the report - 1")
print("------------------------------")
try:
    text = ""
    url = cost_service_url + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing adding cost item")
print("----------------------------------")
try:
    text = ""
    url = cost_service_url + "/api/add/"
    data = requests.post(url,
                         json={'userid': 123123, 'description': 'milk 9', 'category': 'food', 'sum': 8})

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing getting the report - 2")
print("------------------------------")
try:
    text = ""
    url = cost_service_url + "/api/report/?id=123123&year=2026&month=5"
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)
except Exception as e:
    print("problem")
    print(e)