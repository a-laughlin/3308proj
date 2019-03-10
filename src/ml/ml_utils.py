from RNN import RNN

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import torch

def loadData(filename, npoints = 100):
    
    df = pd.read_json(filename, orient = 'values')
    
    y = torch.Tensor(df.values)[:npoints]
    return y


def loadModel(input_file):
    model = torch.load(input_file)
    model.eval()
    return model

def saveModel(model, output_file):
    torch.save(model, output_file)
    
def checkFileName(filename):
    BAD_FILENAME = 0
    GOOD_FILENAME = 1
    
    if not isinstance(filename, str):
        #raise Exception("filename must be string")
        return BAD_FILENAME
    elif len(filename) < 4:
        #raise Exception("filename must consist of at least 4 chars")
        return BAD_FILENAME
    elif filename[-3:] != '.pt':
        #raise Exception('filename must end in .pt')
        return BAD_FILENAME
    else:
        return GOOD_FILENAME

def train(y, model_type = 'RNN',
          lr = 0.001, epochs = 500, npoints = 100, teacher_forcing_ratio = 1):
    
    if y is None:
        raise Exception("Must enter input array to train with")
        return None
    
    acceptableModels = ['RNN']
    
    if model_type == 'RNN':
        model = RNN(1, 32, 1)
    else:
        raise ValueError("Model must be one of {}, but was {}".format(acceptableModels, model_type))
        return None
    
    
    model.mytrain(y, lr = lr, epochs = epochs, teacher_forcing_ratio = teacher_forcing_ratio)
    
    return model

def predict(model, input_data, future_timesteps = 50, plot = True):
    future_output = model.predict(input_data, future_timesteps, plot = plot)
    return future_output

#def foo():
#    
#    model = loadModel()
#    
#    output = predict(model, input_data, future_t)


if __name__ == '__main__':
    
    SAMPLE_DATA_DIR = '../mobile/assets/sample_data/'
    
    input_file = SAMPLE_DATA_DIR + 'ml_input_sine.json'
    
    y = loadData(input_file)
    model = train(y, lr = 0.001, epochs = 300)
    

    plt.plot(np.arange(len(y)), y.numpy())
    plt.xlabel('Time (s)')
    plt.ylabel('Heart Rate (bpm)')
    plt.show()
    
    output = predict(model, y, future_timesteps = 50)