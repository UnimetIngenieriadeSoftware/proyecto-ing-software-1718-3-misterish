import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carga from './src/screens/Carga';
import Header from './src/components/Header';
import MenuBar from './src/components/MenuBar';
import MisteryList from './src/components/MisteryList';
import AlbumList from './ZCHANG/AlbumList';

export default class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header tituloHeader='Misterish'/>
        <MisteryList />
        <MenuBar />

      </View>
    );
  }
}


