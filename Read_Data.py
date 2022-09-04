from urllib import robotparser
import pandas as pd

data = pd.read_csv('data_date.csv')

groupedData = data.groupby(['Date','Country']).agg({
    'AQI Value': ['mean']
})



groupedData.columns = ['AQI']

groupedData = groupedData.reset_index()

AQIStatus = []
for ind in groupedData.index:
    val = groupedData['AQI'][ind]
    if val>=0 and val<50:
        AQIStatus.append("Good")
    elif val>=50 and val<100:
        AQIStatus.append("Moderate")
    elif val>=100 and val<150:
        AQIStatus.append("Unhealthy for Sensitive Groups")
    elif val>=150 and val<200:
        AQIStatus.append("Unhealthy")
    elif val>=200 and val<250:
        AQIStatus.append("Unhealthy")
    elif val>=250 and val<300:
        AQIStatus.append("Very Unhealthy")
    elif val>=300:
        AQIStatus.append("Hazardous")

groupedData["Status"] = AQIStatus
groupedData.index.name = "index"

groupedData = groupedData[["Date","Country","Status","AQI"]]


groupedData.to_csv("processed_data.csv")