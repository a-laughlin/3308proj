import matplotlib.pyplot as plt
import numpy as np
import random

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

class RNN(nn.Module):

    def __init__(self, input_size, hidden_size, output_size):
        super(RNN, self).__init__()

        self.hidden_size = hidden_size

        self.i2h = nn.Linear(input_size + hidden_size, hidden_size)
        self.i2o = nn.Linear(input_size + hidden_size, output_size)
        
        self.trained = False

    def forward(self, input, hidden):

        combined = torch.cat((input, hidden), 1)

        hidden = self.i2h(combined)
        output = self.i2o(combined)

        return output, hidden

    def initHidden(self):
        return torch.zeros(1, self.hidden_size)


    def mytrain(self, y, lr = 0.001, epochs = 1000, teacher_forcing_ratio = 1):

        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.parameters(), lr = lr)

        train_input, train_target = y[:-1].view(-1,1,1), y[1:]

        try:
            for epoch in range(epochs):

                hidden = self.initHidden()

                use_teacher_forcing = True if random.random() < teacher_forcing_ratio else False

                loss = 0
                outputs = []

                if use_teacher_forcing:

                    for i, input in enumerate(train_input):
                        output, hidden = self(input, hidden)
                        outputs.append(output)

                        l = criterion(output, train_target[i])
                        loss += l

                else:

                    output = train_input[0]

                    for i in range(len(train_target)):
                        output, hidden = self(output, hidden)
                        outputs.append(output)

                        l = criterion(output, train_target[i])
                        loss += l

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

                if epoch % 25 == 0:
                    print('epoch {}, loss {}, teacher forcing: {}'.format(epoch, loss, use_teacher_forcing))
                 
                    
            self.trained = True
            
        except KeyboardInterrupt:
            pass
        
        
    def predict(self, y, future = 50, plot = True):
    
        hidden = self.initHidden()
        
        input_y = y[:-1]
        target_y = y[1:]
        
        outputs = []
        for input in input_y.view(-1,1,1):
            output, hidden = self(input, hidden)
            outputs.append(output)
        
        future_outputs = [output]
        for _ in range(future):
            output, hidden = self(output, hidden)
            future_outputs.append(output)
            
        #all_outputs = outputs + future_outputs
        
        pred_target_y = torch.Tensor(outputs).view(-1, 1)
        future_target_y = torch.Tensor(future_outputs).view(-1, 1)
        
        #all_target_y = torch.Tensor(all_outputs).view(-1, 1)
        
        if plot:
            with torch.no_grad():
                t1 = np.arange(len(input_y))
                t2 = np.arange(len(input_y) - 1, len(input_y) - 1 + len(future_outputs))
                
                plt.plot(t1, target_y.detach().numpy(), label = 'Past True', color = 'blue')
                plt.plot(t1, pred_target_y.detach().numpy(), label = 'Past Prediction', color = 'red')
                
                plt.plot(t2, future_target_y.detach().numpy(), linestyle = '--', color = 'red', label = 'Future Prediction')
                
                plt.legend(bbox_to_anchor=(1.04,0.5), loc="center left", borderaxespad=0)
                
        return future_target_y