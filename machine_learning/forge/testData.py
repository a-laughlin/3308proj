import argparse

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

from torch.autograd import Variable

def makeData(npoints = 100, f = None):
    
    data = np.zeros((npoints, 2))
    
    if f is None:
        f = lambda x: x ** 2
    
    np.random.seed(0)
    
    x = np.random.rand(npoints) * 40 - 20
    y = f(x)
    
    data[:,0] = x
    data[:,1] = y
    
    return data


def checkDataFramesEqual(df1, df2, eps):
    
    if (df1.shape != df2.shape):
        return False
    
    cond = True
    
    withinTol = lambda x, y, eps: abs(x - y) < eps 
    
    for row in range(df1.shape[0]):
        for column in range(df1.shape[1]):
            cond = withinTol(df1.values[row][column], df2.values[row][column], eps)
            if cond == False:
                return False
            
    return True


if __name__ == '__main__':
    
    EPS = 10e-6
    
    parser = argparse.ArgumentParser(description='Generate Data and Save to csv.')
    parser.add_argument('--outputfile', type = str, default = 'generatedData')
    args = parser.parse_args()
    
    f = lambda x: np.sin(x)
    npoints = 100
    
    data = makeData(npoints, f)
    
    plt.scatter(data[:,0], data[:,1])
    plt.title('Generated Data')
    plt.xlabel('x')
    plt.ylabel('y')
    
    df = pd.DataFrame(data = data).round(2)
    
    #df.to_csv(args.outputfile + '.csv', index = False)
    
    df.to_json(args.outputfile + '.json', orient = 'values')
    
    df2 = pd.read_json(args.outputfile + '.json', orient = 'values')
    
    print(checkDataFramesEqual(df, df2, EPS))
    
    
    
    
    
    






