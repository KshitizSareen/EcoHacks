from operator import index
import pandas as pd
import time
import datetime


processedData = pd.read_csv('processed_data.csv')

timeStamps = []

modelData = processedData.copy()

counter = 0
countryIndex = {

}

countryCodes = []
for ind in processedData.index:
    val = processedData['Date'][ind]
    country = processedData['Country'][ind]
    s = val
    timestamp = time.mktime(datetime.datetime.strptime(s, "%Y-%m-%d").timetuple())
    timeStamps.append(timestamp)
    if not countryIndex.get(country):
        countryIndex[country]=counter
        countryCode = countryIndex[country]
        counter+=1
    else:
        countryCode = countryIndex[country]
    countryCodes.append(countryCode)


modelData['timeStamp'] = timeStamps
modelData['countryCode']= countryCodes

modelData= modelData.drop(columns=['index'])

modelData.index.name="index"

modelData.to_csv('modelData.csv')

countryIndex = pd.DataFrame(countryIndex.items(),columns=['Country','CountryCode'])

countryIndex.index.name="index"

countryIndex.to_csv('countryIndex.csv')