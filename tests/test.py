import requests
import sys

filename = input("filename=")

# The first service handles logs.
log_service_url = "https://cost-manager-logs-jbhq.onrender.com"

# The second service handles user-related tasks.
user_service_url = "https://cost-manager-users-jfqc.onrender.com"

# The third service handles cost-related tasks.
cost_service_url = "https://cost-manager-costs-52jt.onrender.com"

# The fourth service handles about/team details.
about_service_url = "https://cost-manager-about-ipb3.onrender.com"

output = open(filename, "w", encoding="utf-8")
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
    data = requests.post(
        url,
        json={
            "userid": 123123,
            "description": "milk 9",
            "category": "food",
            "sum": 8
        }
    )

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

output.close()