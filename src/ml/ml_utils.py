import torch
from json import load
from RNN import RNN

def loadData(filename, npoints=100):
    with open(filename,'r') as f:
      return torch.Tensor(load(f))[:npoints]


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

def predict(model, input_data, future_timesteps = 50):
    return model.predict(input_data, future_timesteps)
