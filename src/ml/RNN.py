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


    def mytrain(self, y, lr = 0.001, epochs = 1000, teacher_forcing_ratio = 1, verbose = True):

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

                if verbose:
                    if epoch % 100 == 0:
                        print("Epoch: {}, Loss: {}".format(epoch, loss))

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()


            self.trained = True

        except KeyboardInterrupt:
            pass


    def predict(self, y, future = 50, plot = True):

        hidden = self.initHidden()

        input_y = y[:-1]

        outputs = []
        for input in input_y.view(-1,1,1):
            output, hidden = self(input, hidden)
            outputs.append(output)

        future_outputs = [output]
        for _ in range(future):
            output, hidden = self(output, hidden)
            future_outputs.append(output)

        return torch.Tensor(future_outputs).view(-1, 1)
