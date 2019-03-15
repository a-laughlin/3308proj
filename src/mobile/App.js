import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Svg} from 'expo';
const {Polyline } = Svg;
const data = [10,20,30,40,30,10,80,70]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Svg height="90%" width="100%" >
          <Polyline
              points={data.reduce((prev,y,i)=>prev+`${i*10},${y} `,"")}
              fill="none"
              stroke="black"
              strokeWidth="3"
          />
        </Svg>
      </View>
    );
  }
}
