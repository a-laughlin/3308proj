import argparse

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

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
    
    parser = argparse.ArgumentParser(description='Make ML Data.')
    parser.add_argument('--outputfile', type = str, default = 'ml_input_foo')
    args = parser.parse_args()
    
    df = pd.read_csv('heart_rate_data.csv')
    
    heart_rates = df['Value']
    
    n = 1000
    
    heart_rates[:n].plot()
    
    ml_input = heart_rates[:n]
    
    ml_input = ml_input.to_frame()
    
    ml_input.to_json(args.outputfile + '.json', orient = 'values')
    
    ml_input2 = pd.read_json(args.outputfile + '.json', orient = 'values')
    
    print(checkDataFramesEqual(ml_input, ml_input2, EPS))
    
#    plt.scatter(data[:,0], data[:,1])
#    plt.title('Generated Data')
#    plt.xlabel('x')
#    plt.ylabel('y')
#    
#    df = pd.DataFrame(data = data).round(2)
#    
#    #df.to_csv(args.outputfile + '.csv', index = False)
#    
#    df.to_json(args.outputfile + '.json', orient = 'values')
#    
#    df2 = pd.read_json(args.outputfile + '.json', orient = 'values')
#    
#    print(checkDataFramesEqual(df, df2, EPS))