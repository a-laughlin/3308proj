from RNN import RNN

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import torch

def loadData(filename, npoints = 100):
    
    df = pd.read_json(filename, orient = 'values')
    
    y = torch.Tensor(df.values)[:npoints]
    return y


def loadModel():
    pass

def saveModel():
    pass

def train(model_type = 'RNN', input_file = '../../sample_data/ml_input_foo.json', 
          lr = 0.001, epochs = 500, npoints = 100, teacher_forcing_ratio = 1):
    
    if model_type == 'RNN':
        model = RNN(1, 32, 1)
    
    y = loadData(input_file, npoints = npoints)
    
    y = y.tolist()
    y *= 5
    y = torch.Tensor(y)
    
    train_input, train_target = y[:-1].view(-1,1,1), y[1:]
    
    model.train(train_input, train_target, 
                lr = lr, epochs = epochs, teacher_forcing_ratio = teacher_forcing_ratio)
    
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
    
    input_file = '../../sample_data/ml_input_foo.json'
    model = train(input_file = input_file, lr = 0.001, epochs = 10000)
    
    y = loadData(input_file)
    y = y.tolist()
    y *= 5
    y = torch.Tensor(y)
    
    plt.plot(np.arange(len(y)), y.numpy())
    plt.xlabel('Time (s)')
    plt.ylabel('Heart Rate (bpm)')
    plt.show()
    
    output = predict(model, y, future_timesteps = 50)