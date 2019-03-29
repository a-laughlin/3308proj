import argparse
import torch
import json
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

def goodModelFileName(filename):
    BAD_FILENAME = 0
    GOOD_FILENAME = 1

    if not isinstance(filename, str):
        #raise Exception("model filename must be string")
        return BAD_FILENAME
    elif len(filename) < 4:
        #raise Exception("model filename must consist of at least 4 chars")
        return BAD_FILENAME
    elif filename[-3:] != '.pt':
        #raise Exception('model filename must end in .pt')
        return BAD_FILENAME
    else:
        return GOOD_FILENAME

def goodInputFileName(filename):
    BAD_FILENAME = 0
    GOOD_FILENAME = 1

    if not isinstance(filename, str):
        #raise Exception("input filename must be string")
        return BAD_FILENAME
    elif len(filename) < 5:
        #raise Exception("input filename must consist of at least 5 chars")
        return BAD_FILENAME
    elif filename[-5:] != '.json':
        #raise Exception('input filename must end in .json')
        return BAD_FILENAME
    else:
        return GOOD_FILENAME

def parse_input_file(input_file):

    with open(input_file, 'r') as f:
        y = torch.Tensor(json.load(f)).view(-1, 1)

    return y

def train(y, model_type = 'RNN',
          lr = 0.001, epochs = 500, teacher_forcing_ratio = 1):

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

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input_file', type=str, help='input file name')
    args = parser.parse_args()

    print(args.string)

    #model = loadModel(args.model_name)
