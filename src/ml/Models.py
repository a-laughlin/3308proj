import random

from torch.autograd import Variable

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

class AbstractModel(nn.Module):

    def __init__(self):
        super(AbstractModel, self).__init__()

    def forward(self):
        raise NotImplementedError("Subclasses should implement this!")

    def initHidden(self):
        raise NotImplementedError("Subclasses should implement this!")

    def mytrain(self, y, lr = 0.001, epochs = 500, teacher_forcing_ratio = 1, verbose = True):

        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.parameters(), lr = lr)

        train_input, train_target = y[:-1].view(-1,1,1), y[1:]

        try:
            for epoch in range(1, epochs + 1):

                hidden_states = self.initHidden()

                use_teacher_forcing = True if random.random() < teacher_forcing_ratio else False

                loss = 0
                outputs = []

                if use_teacher_forcing:

                    for i, input in enumerate(train_input):
                        output, hidden_states = self(input, hidden_states)
                        outputs.append(output)

                        l = criterion(output, train_target[i])
                        loss += l

                else:

                    output = train_input[0]

                    for i in range(len(train_target)):
                        output, hidden_states = self(output, hidden_states)
                        outputs.append(output)

                        l = criterion(output, train_target[i])
                        loss += l

                if verbose:
                    if epoch % 100 == 0:
                        print("Epoch: {}, Loss: {}, Teaching Forcing: {}".format(epoch, loss, use_teacher_forcing))

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()



            self.trained = True

        except KeyboardInterrupt:
            pass


    def predict(self, y, future = 50):

        hidden_states = self.initHidden()

        input_y = y[:-1]

        outputs = []
        for input in input_y.view(-1,1,1):
            output, hidden_states = self(input, hidden_states)
            outputs.append(output)

        future_outputs = [output]
        for _ in range(future):
            output, hidden_states = self(output, hidden_states)
            future_outputs.append(output)

        return torch.Tensor(future_outputs).view(-1, 1)

class RNN(AbstractModel):

    def __init__(self, input_size, hidden_size, output_size, batch_size = 1):
        super(RNN, self).__init__()

        self.batch_size = batch_size
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
        return torch.zeros(self.batch_size, self.hidden_size)

class LSTM(AbstractModel):

    def __init__(self, input_size, hidden_size, output_size, batch_size = 1):
        super(LSTM, self).__init__()

        self.batch_size = batch_size
        self.hidden_size = hidden_size

        self.lstm = nn.LSTMCell(input_size, hidden_size)
        self.fc = nn.Linear(input_size + hidden_size, output_size)

        self.trained = False

    def forward(self, x, hidden_states):

        hx, cx = self.lstm(x, hidden_states)

        output = self.fc(torch.cat((x, hx), 1))

        return output, (hx, cx)

    def initHidden(self):
        return (Variable(torch.randn(self.batch_size, self.hidden_size)),
                Variable(torch.randn(self.batch_size, self.hidden_size)))


class GRU(AbstractModel):

    def __init__(self, input_size, hidden_size, output_size, batch_size = 1):
        super(GRU, self).__init__()

        self.batch_size = 1

        self.hidden_size = hidden_size
        self.input_size = input_size
        self.output_size = output_size

        self.lstm = nn.GRUCell(input_size, hidden_size)
        self.fc = nn.Linear(input_size + hidden_size, output_size)

    def forward(self, x, h):

        h = self.lstm(x, h)

        output = self.fc(torch.cat((x, h), 1))

        return output, h

    def initHidden(self):
        return Variable(torch.randn(self.batch_size, self.hidden_size))
