from keras.models import load_model

model = load_model('AQI Model')

inputs  = [2361756400.0,141]

output = model.predict([inputs])

print(output)