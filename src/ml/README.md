# Machine Learning Directory

This directory contains the source files pertaining to the machine learning aspects of the project. Provided here are machine learning architecures ([Models.py](models.py)), a script to train and save a model ([train.py](train.py)), and a script to predict from a saved model ([predict.py](predict.py)). Most of its functionality is built on the machine learning package [Pytorch](https://pytorch.org).  

## Models
The models in [Models.py](models.py) are variants of [recurrent neural networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/). Each model is initialized with three parameters: input dimension, hidden dimension, and output dimension.
```
input_dimension = 1
hidden_dimension = 32
output_dimension = 1

model = Models.RNN(input_dimension, hidden_dimension, output_dimension)
```

Each model inherits from the AbstractModel class, which defines the mytrain and predict methods that are common for each RNN variant.

Currently available models include: Recurrent Neural Network ([RNN](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)), Long Short-Term Memory Network [LSTM](https://colah.github.io/posts/2015-08-Understanding-LSTMs/), and Gated Reccurent Unit ([GRU](https://towardsdatascience.com/understanding-gru-networks-2ef37df6c9be).

## Training and Saving a Model

To train a model, first you need training data. As of now, the training data needs to be a json file (.json) containing a 1-D vector (or whatever dimension the sequence of data is):
```
[1, 2, 3, 4, 5, ..., n - 1, n]
```
Then, our crude but simple solution is to open [train.py](train.py) and update the values of these two variables:
```
train_array_file = '../web/src/sample_data/ml_input_foo.json'
output_model_file = '../web/src/sample_data/ml_model_foo.pt'
```
The variable ```train_array_file``` contains the training data, and ```output_model_file``` is the name of the eventual saved model.

Then, you select select the model you want to train with the appropriate input parameters:
```
input_dimension = 1
hidden_dimension = 32
output_dimension = 1

model = Models.RNN(input_dimension, hidden_dimension, output_dimension)
```
The model in this example is an RNN, but you can also choose an LSTM or GRU.

Then, you train the model as so with your desired training settings:
```
ml_utils.train(model, y, lr = 0.001, epochs = 500, teacher_forcing_ratio = 1, verbose = False)
```
Teacher forcing can be learned about [here](https://cedar.buffalo.edu/~srihari/CSE676/10.2.1%20TeacherForcing.pdf).

Finally, you save the model:
```
ml_utils.saveModel(model, output_model_file)
```
## Obtaining a Prediction from a Saved Model

Predicting is a little more sophisticated than training. Although you can always opt to manually update the [predict.py](predict.py) script, there is a command line option.
```
usage: predict.py [-h] [--future FUTURE] [--input INPUT] [--model MODEL]

Predict future heartbeats given a previous window of data, and future
timesteps to predict

optional arguments:
  -h, --help       show this help message and exit
  --future FUTURE  Future timesteps to predict: default = 50
  --input INPUT    List of ints: default = [1,2,3,4,5,6]
  --model MODEL    Location of trained model: default =
                   ../api/sample_data/ml_model_foo.pt
```
As you can see, it requires a saved model (.pt). 

## Testing
Testing can be performed by running ```./ml_utils_test.py``` on the command line.
## References
1. Pytorch [https://pytorch.org](https://pytorch.org)
2. Recurrent Neural Networks [http://karpathy.github.io/2015/05/21/rnn-effectiveness/](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
3. Long Short-Term Memory Networks [https://colah.github.io/posts/2015-08-Understanding-LSTMs/](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)
4. Gated Recurrent Unit [https://towardsdatascience.com/understanding-gru-networks-2ef37df6c9be](https://towardsdatascience.com/understanding-gru-networks-2ef37df6c9be)
5. Teacher Forcing [https://cedar.buffalo.edu/~srihari/CSE676/10.2.1%20TeacherForcing.pdf](https://cedar.buffalo.edu/~srihari/CSE676/10.2.1%20TeacherForcing.pdf)
