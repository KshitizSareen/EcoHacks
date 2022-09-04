from statistics import mode
import pandas as pd

from keras.models import Sequential
from keras.layers import Dense
from keras.callbacks import EarlyStopping

train_df = pd.read_csv('modelData.csv')

print(train_df.head())

trainX = train_df.drop(columns=['Status','AQI','index','Date','Country'])
print(trainX)
trainY = train_df[['AQI']]

n_cols = trainX.shape[1]


print(trainY.head())

model = Sequential()

model.add(Dense(200,activation='relu',input_shape= (n_cols,)))
model.add(Dense(200,activation='relu'))
model.add(Dense(1))
model.compile(optimizer='adam',loss='mean_squared_error')

earlyStoppingMonitor = EarlyStopping(patience=3)

model.fit(trainX,trainY,validation_split=0.2,epochs = 30, callbacks=[earlyStoppingMonitor])

model.save('AQI Model')
