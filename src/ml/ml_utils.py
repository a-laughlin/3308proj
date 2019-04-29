import argparse
import torch
import json

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
    elif len(filename) < 6:
        #raise Exception("input filename must consist of at least 6 chars")
        return BAD_FILENAME
    elif filename[-5:] != '.json':
        #raise Exception('input filename must end in .json')
        return BAD_FILENAME
    else:
        return GOOD_FILENAME

def parse_input_list(input_list=[1,2,3,4]):
    return torch.Tensor(input_list).view(-1, 1)

def parse_input_file(input_file):
    with open(input_file, 'r') as f:
        y = json.load(f)
    return torch.Tensor(y).view(-1, 1)

def train(model, y, lr = 0.001, epochs = 500, teacher_forcing_ratio = 1, verbose = False):
    model.mytrain(y, lr = lr, epochs = epochs,
                  teacher_forcing_ratio = teacher_forcing_ratio, verbose = verbose)
    return model

def predict(model, input_data, future_timesteps = 50):
    return model.predict(input_data, future_timesteps)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input_file', type=str, help='input file name')
    args = parser.parse_args()

    print(args.string)

    #model = loadModel(args.model_name)
