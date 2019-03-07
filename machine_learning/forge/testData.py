import argparse

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def makeData(npoints = 100, f = None):
    
    if f is None:
        f = lambda x: x ** 2
    
    np.random.seed(0)
    
    x = np.arange(npoints) / 5
    y = f(x)
    
    return y

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
    parser.add_argument('--outputfile', type = str, default = 'ml_input_foo.json')
    parser.add_argument('--heartbeat', type = bool, default = True)
    parser.add_argument('--sine', type = bool, default = True)
    parser.add_argument('--npoints', type = int, default = 200)
    parser.add_argument('--plot', type = bool, default = True)
    args = parser.parse_args()
    
    n = args.npoints
    outputfile = args.outputfile
    
    if args.heartbeat:
        df = pd.read_csv('heart_rate_data.csv')
        heart_rates = df['Value']
        
        ml_input = heart_rates[:n].to_frame()
        
    elif args.sine:
        f = lambda x: np.sin(x)
        
        y = makeData(npoints = n, f = f)
        ml_input = pd.DataFrame(data = y)

    # Write file
    ml_input.to_json(outputfile, orient = 'values')
    
    # Read file
    ml_input2 = pd.read_json(args.outputfile, orient = 'values')
    
    print(checkDataFramesEqual(ml_input, ml_input2, EPS))
    
    if args.plot:
        ml_input.plot()
   